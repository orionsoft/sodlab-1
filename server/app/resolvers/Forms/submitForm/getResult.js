import prependKey from 'app/helpers/misc/prependKey'
import validate from './validate'

export default async function({form, itemId, data: rawData}) {
  const collection = await form.collectionDb()
  const data = await validate({form, rawData})
  if (form.type === 'create') {
    const newItemId = await collection.insert({data, createdAt: new Date()})
    return {_id: newItemId, data}
  } else if (form.type === 'update') {
    if (!itemId) {
      throw new Error('Item id is required')
    }
    const item = await collection.findOne(itemId)
    if (!item) {
      throw new Error('Item not found')
    }
    const $set = prependKey(data, 'data')
    await item.update({$set})
    return await collection.findOne(itemId)
  }
}
