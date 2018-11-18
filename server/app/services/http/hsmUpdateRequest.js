import {route} from '@orion-js/app'
import Requests from 'app/helpers/functionTypes/signDocumentWithHSM/Requests'
import Collections from 'app/collections/Collections'

route('/hsm/update-requests', async function({getBody, ...params}) {
  console.log('receiving request from HSM')
  const body = await getBody()
  console.log('hsm callback body', body)
  if (!body) return 'invalid request'
  const data = JSON.parse(body)
  if (!data.requestId) {
    return 'invalid request'
  }

  const request = await Requests.findOne({requestId: data.requestId, status: 'pending'})
  if (!request) {
    return 'invalid request'
  }

  const result = data.documents[0]
  if (!result) {
    return 'no result in results'
  }

  if (!result.success) {
    await request.update({$set: {status: 'error', reason: result.error}})
    return 'ok :('
  }

  await request.update({$set: {status: 'success', url: result.url}})

  const {collectionId, itemId, signedFileKey} = request

  const col = await Collections.findOne(collectionId)
  const collection = await col.db()
  const item = await collection.findOne(itemId)

  const key = `data.${signedFileKey}`

  console.log({$set: {[key]: result.url}})

  await item.update({$set: {[key]: result.url}})

  return 'cloud hsm ok'
})
