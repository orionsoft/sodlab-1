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
      console.log('button', button)
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

      const afterHooks = await Hooks.find({_id: {$in: button.afterHooksIds}}).toArray()
      console.log('afterHooks', afterHooks)
      let obtainedItems = []
      let documentsBase64
      console.log(params)
      const hsmHook = await Hooks.findOne(button.hsmHookId)
      const {type, fixed, parameterName} = hsmHook.options.signingReason
      console.log(hsmHook.options.signingReason.fixed)
      console.log('hsmHook', hsmHook)

      const options = await hsmHook.getOptions({params})
      console.log(options)
      const {apiUrl, fileKey, layout, userId, clientId, signedFileKey, collectionId} = options

      if (all) {
        const getItems = await tableResult(params)
        obtainedItems = await getItems.cursor.toArray()
        if (!obtainedItems.length) return null
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
      console.log('obtained items', obtainedItems.length)
      let itemsIds = []
      documentsBase64 = obtainedItems
        .filter(item => item.data[fileKey])
        .map(async item => {
          const file = item.data[fileKey]

          let fileURL
          if (typeof file === 'string' && /^https?:.*/.test(file)) {
            fileURL = file
          } else if (typeof file === 'object') {
            fileURL = `https://s3.amazonaws.com/${file.bucket}/${file.key.replace(/ /, '%20')}`
          }

          // const fileData = await rp({
          //   uri: fileURL,
          //   method: 'GET',
          //   encoding: null,
          //   headers: {
          //     'Content-type': 'applcation/pdf'
          //   }
          // })
          const signingReason = type === 'fixed' ? fixed.value : item.data[`${parameterName}`]
          itemsIds.push(item._id)

          return {
            // data: Buffer.from(fileData).toString('base64'),
            layout,
            signingReason,
            documentId: item._id
          }
        })
      console.log('documentsBase64', documentsBase64)
      const documents = await Promise.all(documentsBase64)
      console.log('docs that will be sent to th HSM', documents.length)
      const callback = `${process.env.SERVER_URL}/callbacks/cloud-hsm`
      const body = {
        documents,
        clientId,
        userId,
        callbacks: [callback]
      }
      console.log('api url', apiUrl)
      const uri = apiUrl
        ? 'https://api-test.signer.sodlab.cl/sign'
        : 'https://api.signer.sodlab.cl/sign'

      console.log('Hsm request:', uri)

      // const result = await rp({
      //   method: 'POST',
      //   uri,
      //   body,
      //   json: true
      // })

      try {
        await HsmRequests.insert({
          requestId: '123',
          clientId,
          userId,
          collectionId,
          environmentId: button.environmentId,
          itemsSent: itemsIds.length,
          signedFileKey,
          status: 'pending',
          createdAt: new Date()
        })
      } catch (err) {
        console.log('Error inserting to Hsm Batch Requests', err)
      }

      const hsmRequestedItems = itemsIds.map(async itemId => {
        await HsmDocuments.insert({
          requestId: '123',
          clientId,
          userId,
          itemId,
          collectionId,
          environmentId: button.environmentId,
          signedFileKey,
          status: 'pending',
          createdAt: new Date()
        })
      })

      await Promise.all(hsmRequestedItems)
      // console.log('Result:', result)

      for (let parameters of obtainedItems) {
        parameters = {_id: parameters._id, ...parameters.data}
        await buttonRunHooks({buttonId, parameters}, viewer)
      }
    } catch (err) {
      console.log('Err:', err)
    }
  }
})
