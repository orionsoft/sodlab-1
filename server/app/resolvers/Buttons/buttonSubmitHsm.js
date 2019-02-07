import {resolver} from '@orion-js/app'
import rp from 'request-promise'
import Hooks from 'app/collections/Hooks'
import HsmRequests from 'app/collections/HsmRequests'
import HsmDocuments from 'app/collections/HsmDocuments'
import {runParallelHooks, runSequentialHooks} from 'app/helpers/functionTypes/helpers'

export default resolver({
  params: {
    button: {
      type: 'blackbox'
    },
    obtainedItems: {
      type: ['blackbox']
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({button, obtainedItems}, viewer) {
    try {
      const hsmHook = await Hooks.findOne(button.hsmHookId)
      const {type, fixed, parameterName} = hsmHook.options.signingReason

      // passing an empty object will only get the fixed values from the hook configuration
      // if parameters are needed, the interpretation must be done manually
      // if the clientId and userId are needed as parameters, the resolver must
      // be changed to send multiple request to the HSM with the different values
      const options = await hsmHook.getOptions({params: {}})
      const {
        apiUrl,
        fileKey,
        layout,
        userId,
        clientId,
        signedFileKey,
        collectionId,
        onRequestSentHooksIds,
        onRequestReceivedHooksIds,
        requestTimeout,
        onRequestErrorHooksIds,
        onSuccessHooksIds,
        onErrorHooksIds
      } = options

      let itemsIds = []
      const documentsBase64 = obtainedItems
        .filter(item => item.data[fileKey])
        .map(async item => {
          const file = item.data[fileKey]

          let fileURL
          if (typeof file === 'string' && /^https?:.*/.test(file)) {
            fileURL = file
          } else if (typeof file === 'object') {
            fileURL = `https://s3.amazonaws.com/${file.bucket}/${file.key.replace(/ /g, '%20')}`
          }

          let fileData
          try {
            fileData = await rp({
              uri: fileURL,
              method: 'GET',
              encoding: null,
              headers: {
                'Content-type': 'application/pdf'
              }
            })
          } catch (err) {
            console.log('error downloading file', err)
            return null
          }

          const signingReason = type === 'fixed' ? fixed.value : item.data[`${parameterName}`]
          itemsIds.push(item._id)

          return {
            data: Buffer.from(fileData).toString('base64'),
            layout,
            signingReason,
            documentId: item._id
          }
        })

      const documents = await Promise.all(documentsBase64)

      const callbacks =
        process.env.NODE_ENV !== 'production'
          ? ['https://beta.integrations.sodlab.com/api/test']
          : [`${process.env.SERVER_URL}/hsm/update-requests`]
      const body = {
        documents,
        clientId,
        userId,
        callbacks
      }

      const uri = apiUrl
        ? 'https://api-test.signer.sodlab.cl/sign'
        : 'https://api.signer.sodlab.cl/sign'
      console.log(`Sending a hsm batch request to "${uri}" with a callback to: ${callbacks[0]}`)
      let hsmRequest
      try {
        const requestTimestamp = new Date()
        const hsmRequestId = await HsmRequests.insert({
          clientId,
          userId,
          collectionId,
          environmentId: button.environmentId,
          itemsSent: itemsIds.length,
          status: 'initiated',
          onSuccessHooksIds,
          onErrorHooksIds,
          shouldStopHooksOnError: button.shouldStopHooksOnError || false,
          erpUserId: viewer.userId,
          createdAt: requestTimestamp
        })
        hsmRequest = await HsmRequests.findOne({_id: hsmRequestId})
        hsmRequest.updateDateAndTime({dateObject: requestTimestamp, field: 'initiatedAt'})
        console.log('Sending a batch request to the HSM with data: ', hsmRequest)
      } catch (err) {
        console.log('Error inserting to Hsm Requests', err)
        return
      }

      let result
      try {
        const timeout = requestTimeout ? requestTimeout * 60000 : 120000
        result = await rp({
          method: 'POST',
          uri,
          body,
          json: true,
          timeout
        })
        if (Array.isArray(onRequestSentHooksIds) && onRequestSentHooksIds.length > 0) {
          obtainedItems.map(
            async item =>
              await runSequentialHooks({
                hooksIds: onRequestSentHooksIds,
                params: {_id: item._id, ...item.data},
                userId: viewer.userId,
                shouldStopHooksOnError: button.shouldStopHooksOnError,
                environmentId: button.environmentId
              })
          )
        }
      } catch (err) {
        const hsmRequestError = typeof err === 'object' ? {...err} : err.toString()
        const error = {
          hsmRequestError,
          customError: 'Error sending request to HSM',
          hsmError: err.toString(),
          buttonName: button.name
        }
        console.log(error)
        if (Array.isArray(onRequestErrorHooksIds) && onRequestErrorHooksIds.length > 0) {
          obtainedItems.map(
            async item =>
              await runParallelHooks({
                hooksIds: onRequestErrorHooksIds,
                params: {_id: item._id, ...item.data},
                userId: viewer.userId
              })
          )
        }
        return
      }
      console.log('Batch HSM request made', {result})
      if (Array.isArray(onRequestReceivedHooksIds) && onRequestReceivedHooksIds.length > 0) {
        obtainedItems.map(async item => {
          await runSequentialHooks({
            hooksIds: onRequestReceivedHooksIds,
            params: {_id: item._id, ...item.data},
            userId: viewer.userId,
            shouldStopHooksOnError: button.shouldStopHooksOnError,
            environmentId: button.environmentId
          }).catch(err => {
            const hsmOnRequestReceivedHooksError =
              typeof err === 'object' ? {...err} : err.toString()
            const error = {
              hsmOnRequestReceivedHooksError,
              customError: 'Error sending request to HSM',
              hsmError: err.toString(),
              buttonName: button.name
            }
            console.log(error)
          })
        })
      }

      try {
        const requestCompleteTimestamp = new Date()
        await hsmRequest.update({
          $set: {
            requestId: result.requestId,
            status: 'pending'
          }
        })
        hsmRequest.updateDateAndTime({dateObject: requestCompleteTimestamp, field: 'pendingAt'})
      } catch (err) {
        console.log('Error updating Hsm Batch Requests', err)
        return
      }

      itemsIds.map(async itemId => {
        try {
          return await HsmDocuments.insert({
            requestId: result.requestId,
            itemId,
            collectionId,
            signedFileKey,
            status: 'pending',
            createdAt: new Date()
          })
        } catch (err) {
          console.log(`Error creating a record in hsm documents for the itemId ${itemId}`, err)
        }
      })

      return true
    } catch (err) {
      console.log('Err:', err)
    }
  }
})
