import rp from 'request-promise'
import HsmRequests from 'app/collections/HsmRequests'
import HsmDocuments from 'app/collections/HsmDocuments'
import {runParallelHooks, runSequentialHooks} from 'app/helpers/functionTypes/helpers'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'

export default {
  name: 'Firmar documento con hsm',
  optionsSchema: {
    apiUrl: {
      type: Boolean,
      label: 'Api HSM',
      fieldType: 'select',
      fixed: true,
      fieldOptions: {
        options: [{label: 'Producción', value: false}, {label: 'Test', value: true}]
      }
    },
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
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
    userId: {
      label: 'Id del usuario',
      type: String
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
    },
    shouldStopHooksOnError: {
      label:
        '(opcional) ¿Detener la ejecución de hooks si ocurre un error? (Por defecto no se detendrá)',
      type: Boolean,
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      optional: true,
      defaultValue: false
    }
  },
  async execute({options, params, userId: erpUserId, environmentId, hook, hooksData, viewer}) {
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
      onRequestSentHooksIds,
      onRequestReceivedHooksIds,
      requestTimeout,
      onRequestErrorHooksIds,
      onSuccessHooksIds,
      onErrorHooksIds,
      shouldStopHooksOnError
    } = options

    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      return throwHookError(err)
    }

    const file = item.data[fileKey]
    if (!file) {
      const err = `Document with id ${itemId} from col ${collectionId} doesn't contain a file in the field ${fileKey}`
      return throwHookError(err)
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
      const err = `Error downloading file from ${fileURL}`
      return throwHookError(err)
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
        shouldStopHooksOnError,
        erpUserId,
        createdAt: requestTimestamp
      })
      hsmRequest = await HsmRequests.findOne({_id: hsmRequestId})
      hsmRequest.updateDateAndTime({dateObject: requestTimestamp, field: 'initiatedAt'})
      console.log('Sending a single request to the HSM with data: ', hsmRequest)
    } catch (err) {
      console.log('Error inserting to Hsm Requests')
      return throwHookError(err)
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
        await runSequentialHooks({
          hooksIds: onRequestSentHooksIds,
          params,
          userId: erpUserId,
          shouldStopHooksOnError,
          environmentId
        })
      }
    } catch (err) {
      console.log(`Error sending request to HSM`, err)
      if (Array.isArray(onRequestErrorHooksIds) && onRequestErrorHooksIds.length > 0) {
        await runParallelHooks({hooksIds: onRequestErrorHooksIds, params, userId: erpUserId})
      }
      return throwHookError(err)
    }

    console.log('Single HSM request made', {result})
    if (Array.isArray(onRequestReceivedHooksIds) && onRequestReceivedHooksIds.length > 0) {
      await runSequentialHooks({
        hooksIds: onRequestReceivedHooksIds,
        params,
        userId: erpUserId,
        shouldStopHooksOnError,
        environmentId
      }).catch(err => {
        console.log('Error executing hooks after receiving a response from the HSM', err)
        return throwHookError(err)
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
    const newItem = await getItemFromCollection({collectionId, itemId: item._id})
    return {start: item, result: newItem, success: true}
  }
}
