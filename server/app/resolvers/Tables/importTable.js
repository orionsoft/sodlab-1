import {resolver} from '@orion-js/app'
import Collections from 'app/collections/Collections'
import prependKey from 'app/helpers/misc/prependKey'
import {validate, clean} from '@orion-js/schema'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    },
    items: {
      type: ['blackbox']
    },
    action: {
      type: String
    }
  },
  returns: Boolean,
  role: 'admin',
  mutation: true,
  async resolve({collectionId, items: itemData, action}, viewer) {
    const collection = await Collections.findOne(collectionId)
    const itemsDB = await collection.db()
    if (action === 'update') {
      for (const item of itemData) {
        if (!item._id) {
          throw new Error('Item id not found')
        }
        const itemResult = await itemsDB.findOne(item._id)
        if (!itemResult) continue
        delete item._id
        const $set = prependKey(item, 'data')
        await itemResult.update({$set})
      }
    } else if (action === 'insert') {
      const schema = await collection.schema()
      for (const item of itemData) {
        let data = await clean(schema, item)
        try {
          // Validate with collection schema
          await validate(schema, data)
        } catch (error) {
          if (error.isValidationError) {
            throw error.prependKey('data')
          }
          throw error
        }
        await itemsDB.insert({data: data})
      }
    }

    return true
  }
})
