import {route} from '@orion-js/app'
import Requests from './Requests'
import Collections from 'app/collections/Collections'

route('/callbacks/cloud-hsm', async function({getBody, ...params}) {
  const body = await getBody()
  console.log('hsm callback body', body)
  if (!body) return 'invalid request'
  const data = JSON.parse(body)
  console.log(data)
  if (!data.request_id) {
    console.log('invalid request')
    return 'invalid request'
  }

  const request = await Requests.findOne({requestId: data.request_id, status: 'pending'})
  if (!request) {
    console.log('invalid request')
    return 'invalid request'
  }

  const result = data.results[0]
  if (!result) {
    console.log('no result in results')
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
