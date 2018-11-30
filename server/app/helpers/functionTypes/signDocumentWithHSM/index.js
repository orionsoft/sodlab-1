import Collections from 'app/collections/Collections'
import rp from 'request-promise'
import HsmRequests from 'app/collections/HsmRequests'
import HsmDocuments from 'app/collections/HsmDocuments'
import {runParallelHooks, runSequentialHooks} from 'app/helpers/functionTypes/helpers'

export default {
  name: 'Firmar documento con hsm',
  optionsSchema: {
    clientId: {
      label: 'Client id',
      type: String
    },
    signingReason: {
      label: 'Signing reason',
      type: String
    },
    layout: {
      label: 'Layout',
      type: String
    },
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    userId: {
      label: 'Id del usuario',
      type: String
    },
    itemId: {
      type: String,
      label: 'Id del item'
    },
    fileKey: {
      type: String,
      label: 'Campo donde esta el archivo',
      fieldType: 'collectionFieldSelect'
    },
    signedFileKey: {
      type: String,
      label: 'Campo donde se dejará el documento firmado',
      fieldType: 'collectionFieldSelect'
    },
    apiUrl: {
      type: Boolean,
      label: 'Api HSM',
      fieldType: 'select',
      fixed: true,
      fieldOptions: {
        options: [{label: 'Producción', value: false}, {label: 'Test', value: true}]
      }
    },
    onRequestSentHooksIds: {
      label: 'Hooks a ejecutar al solicitar un Request Id',
      type: ['ID'],
      fieldType: 'hookSelect',
      fieldOptions: {multi: true},
      optional: true,
      defaultValue: []
    },
    onRequestReceivedHooksIds: {
      label: 'Hooks a ejecutar al recibir el Request Id',
      type: ['ID'],
      fieldType: 'hookSelect',
      fieldOptions: {multi: true},
      optional: true,
      defaultValue: []
    },
    requestTimeout: {
      label: 'Tiempo de espera para recibir el Request Id (minutos, default es 2 min)',
      type: Number,
      optional: true,
      defaultValue: 2
    },
    onRequestErrorHooksIds: {
      label: 'Hooks a ejecutar si el Request Id no se recibe en el tiempo especificado',
      type: ['ID'],
      fieldType: 'hookSelect',
      fieldOptions: {multi: true},
      optional: true,
      defaultValue: []
    },
    onSuccessHooksIds: {
      label: 'Hooks a ejecutar al recibir exitosamente el documento',
      type: ['ID'],
      fieldType: 'hookSelect',
      fieldOptions: {multi: true},
      optional: true,
      defaultValue: []
    },
    onErrorHooksIds: {
      label: 'Hooks a ejecutar si el documento se recibe con error',
      type: ['ID'],
      fieldType: 'hookSelect',
      fieldOptions: {multi: true},
      optional: true,
      defaultValue: []
    }
  },
  async execute({options, params, userId: erpUserId, environmentId}) {
    let errorObject = {
      envId: environmentId,
      function: 'hook: Sign document with hsm'
    }

    const {
      clientId,
      signingReason,
      layout,
      collectionId,
      itemId,
      fileKey,
      signedFileKey,
      userId,
      apiUrl,
      // new fields
      onRequestSentHooksIds,
      onRequestReceivedHooksIds,
      requestTimeout,
      onRequestErrorHooksIds,
      onSuccessHooksIds,
      onErrorHooksIds
    } = options

    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)
    if (!item) {
      errorObject.level = 'ERROR'
      errorObject.msg = `Document with id ${itemId} from col ${collectionId} not found`
      console.log(errorObject)
      return {success: false}
    }
    const file = item.data[fileKey]
    if (!file) {
      errorObject.level = 'ERROR'
      errorObject.msg = `Document with id ${itemId} from col ${collectionId} not found doesn't contain a file in the field ${fileKey}`
      console.log(errorObject)
      return {success: false}
    }

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
          'Content-type': 'applcation/pdf'
        }
      })
    } catch (err) {
      errorObject.level = 'ERROR'
      errorObject.msg = `Error downloading file from ${fileURL}`
      errorObject.err = err
      console.log(errorObject)
      return {success: false}
    }

    const base64 = Buffer.from(fileData).toString('base64')
    const doc = {
      documentId: itemId,
      data: base64,
      signingReason,
      layout
    }

    const callbacks =
      process.env.NODE_ENV !== 'production'
        ? ['https://beta.integrations.sodlab.com/api/test']
        : [`${process.env.SERVER_URL}/hsm/update-requests`]
    const body = {
      documents: [doc],
      clientId,
      userId,
      callbacks
    }

    const uri = apiUrl
      ? 'https://api-test.signer.sodlab.cl/sign'
      : 'https://api.signer.sodlab.cl/sign'
    console.log(`Sending a hsm single request to "${uri}" with a callback to: ${callbacks[0]}`)

    let hsmRequest
    try {
      const requestTimestamp = new Date()
      const hsmRequestId = await HsmRequests.insert({
        clientId,
        userId,
        collectionId,
        environmentId,
        itemsSent: 1,
        status: 'initiated',
        onSuccessHooksIds,
        onErrorHooksIds,
        erpUserId,
        createdAt: requestTimestamp
      })
      hsmRequest = await HsmRequests.findOne({_id: hsmRequestId})
      hsmRequest.updateDateAndTime({dateObject: requestTimestamp, field: 'initiatedAt'})
      console.log('Sending a single request to the HSM with data: ', hsmRequest)
    } catch (err) {
      console.log('Error inserting to Hsm Requests')
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
        await runSequentialHooks({hooksIds: onRequestSentHooksIds, params, userId: erpUserId})
      }
    } catch (err) {
      errorObject.level = 'ERROR'
      errorObject.msg = `Error sending request to HSM`
      errorObject.body = body
      errorObject.err = err.toString()
      console.log(errorObject)
      if (Array.isArray(onRequestErrorHooksIds) && onRequestErrorHooksIds.length > 0) {
        await runParallelHooks({hooksIds: onRequestErrorHooksIds, params, userId: erpUserId})
      }
      return {success: false}
    }
    console.log('Single HSM request made', {result})
    if (Array.isArray(onRequestReceivedHooksIds) && onRequestReceivedHooksIds.length > 0) {
      await runSequentialHooks({hooksIds: onRequestReceivedHooksIds, params, userId: erpUserId})
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
    }

    try {
      await HsmDocuments.insert({
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

    console.log(result)
    return {success: true}
  }
}
