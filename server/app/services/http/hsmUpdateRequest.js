import {route} from '@orion-js/app'
import Collections from 'app/collections/Collections'
import HsmRequests from 'app/collections/HsmRequests'
import HsmDocuments from 'app/collections/HsmDocuments'

route('/hsm/update-requests', async function({getBody, ...params}) {
  const receivedAt = new Date()
  console.log('receiving request from HSM')
  const body = await getBody()
  console.log('hsm callback body', body)
  if (!body) return 'invalid request'
  const data = JSON.parse(body)
  if (!data.requestId) {
    return 'Request does not include a requestId'
  }

  const hsmRequest = await HsmRequests.findOne({
    requestId: data.requestId,
    clientId: data.clientId,
    status: 'pending'
  })
  if (!hsmRequest) {
    return 'Hsm Request not found'
  }
  const documents = data.documents
  if (!documents) {
    return 'No documents received in request'
  }

  const failedDocumentsIds = []
  const hsmDocuments = documents.map(async doc => {
    try {
      const hsmDoc = await HsmDocuments.findOne({itemId: doc.documentId, requestId: data.requestId})
      const col = await Collections.findOne(hsmDoc.collectionId)
      const collection = await col.db()
      const item = await collection.findOne(doc.documentId)

      if (!doc.success) {
        failedDocumentsIds.push(doc.documentId)
        hsmRequest.updateDateAndTime({dateObject: new Date(), field: 'errorAt'})
        hsmRequest.runParallelHooks({item, success: false})
        await hsmDoc.update({$set: {status: 'error'}})
      } else {
        await hsmDoc.update({$set: {status: 'completed', documentUrl: doc.url}})
        const key = `data.${hsmDoc.signedFileKey}`
        await item.update({$set: {[key]: doc.url}})
        hsmRequest.runSequentialHooks({item, success: true})
      }
    } catch (err) {
      console.log(
        `Error processing doc id ${doc.documentId} from HSM request ${data.requestId}`,
        err
      )
      failedDocumentsIds.push(doc.documentId)
      hsmRequest.updateDateAndTime({dateObject: new Date(), field: 'errorAt'})
      return null
    }
  })

  const receivedDocuments = await Promise.all(hsmDocuments)

  if (failedDocumentsIds.length > 0) {
    hsmRequest.update({
      $set: {
        status: 'incomplete',
        itemsReceived: receivedDocuments.length,
        failedDocumentsIds,
        requestTime: data.requestTime
      }
    })
    hsmRequest.updateDateAndTime({dateObject: receivedAt, field: 'incompleteAt'})
    console.log({msg: `Hsm request id ${data.requestId} processed partially`})
    return {msg: `Hsm request id ${data.requestId} processed partially`, failedDocumentsIds}
  } else {
    hsmRequest.update({
      $set: {
        status: 'completed',
        itemsReceived: receivedDocuments.length,
        requestTime: data.requestTime
      }
    })
    hsmRequest.updateDateAndTime({dateObject: receivedAt, field: 'completedAt'})
    console.log({msg: `Hsm request id ${data.requestId} processed ok`})
    return {msg: `Hsm request id ${data.requestId} processed ok`}
  }
})
