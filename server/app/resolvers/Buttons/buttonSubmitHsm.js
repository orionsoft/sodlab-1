import {resolver} from '@orion-js/app'
import rp from 'request-promise'
import tableResult from 'app/resolvers/Tables/tableResult'
import Hooks from 'app/collections/Hooks'
import {requireTwoFactor} from '@orion-js/auth'
import Buttons from 'app/collections/Buttons'
import Users from 'app/collections/Users'
import HsmRequests from 'app/collections/HsmRequests'
import HsmDocuments from 'app/collections/HsmDocuments'
import buttonRunHooks from './buttonRunHooks'

export default resolver({
  params: {
    buttonId: {
      type: 'ID',
      optional: true
    },
    parameters: {
      type: ['blackbox'],
      optional: true
    },
    all: {
      type: Boolean,
      optional: true
    },
    params: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({buttonId, parameters: items, all, params}, viewer) {
    try {
      const button = await Buttons.findOne(buttonId)

      if (Object.keys(viewer).length !== 0) {
        const user = await Users.findOne({_id: viewer.userId})
        const twoFactor = await user.hasTwoFactor()
        if (!twoFactor && button.requireTwoFactor) {
          throw new Error('Necesitas activar autenticación de dos factores en "Mi Cuenta"')
        }
      }

      if (button.requireTwoFactor) {
        await requireTwoFactor(viewer)
      }

      let obtainedItems = []
      let documentsBase64 = []

      const hsmHook = await Hooks.findOne(button.hsmHookId)
      const {type, fixed, parameterName} = hsmHook.options.signingReason

      const options = await hsmHook.getOptions({params})
      const {apiUrl, fileKey, layout, userId, clientId, signedFileKey, collectionId} = options

      if (all) {
        const getItems = await tableResult(params)
        obtainedItems = await getItems.cursor.toArray()
        if (!obtainedItems.length) return
      } else {
        const getItems = await tableResult(params)
        const arrayItems = await getItems.cursor.toArray()
        const itemsObject = items[0]
        const broughtItems = Object.keys(itemsObject)
          .map(key => {
            const value = itemsObject[key]
            return {key, value}
          })
          .filter(item => item.value)
          .map(item => item.key)

        obtainedItems = await arrayItems.filter(item => broughtItems.includes(item._id))
        if (!obtainedItems.length) return
      }

      let itemsIds = []
      documentsBase64 = obtainedItems
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
          ? ['https://integrations-beta.sodlab-document-editor.com/api/test']
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
      console.log(`Sending hsm request to "${uri}" with callback`, {callbacks})
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
          createdAt: requestTimestamp
        })
        hsmRequest = await HsmRequests.findOne({_id: hsmRequestId})
        hsmRequest.updateDateAndTime({dateObject: requestTimestamp, field: 'requestedAt'})
        console.log('Sending a batch request to the HSM with data: ', hsmRequest)
      } catch (err) {
        console.log('Error inserting to Hsm Batch Requests', err)
        return
      }

      let result
      try {
        result = await rp({
          method: 'POST',
          uri,
          body,
          json: true
        })
      } catch (err) {
        console.log('Error sending request to HSM', err)
        return
      }
      console.log('Batch HSM request made', result)

      try {
        const requestCompleteTimestamp = new Date()
        await hsmRequest.update({
          $set: {
            requestId: result.requestId,
            status: 'pending'
          }
        })
        hsmRequest.updateDateAndTime({dateObject: requestCompleteTimestamp, field: 'completedAt'})
      } catch (err) {
        console.log('Error updating Hsm Batch Requests', err)
        return
      }

      let failedHsmDocumentRecords = []
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
          failedHsmDocumentRecords.push(itemId)
        }
      })

      obtainedItems.map(async item => {
        if (failedHsmDocumentRecords.includes(item._id)) return

        const parameters = {_id: item._id, ...item.data}
        await buttonRunHooks({buttonId, parameters}, viewer)
      })

      return
    } catch (err) {
      console.log('Err:', err)
    }
  }
})
