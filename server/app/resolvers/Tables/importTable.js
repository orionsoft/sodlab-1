import {resolver} from '@orion-js/app'
import Collections from 'app/collections/Collections'
import prependKey from 'app/helpers/misc/prependKey'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    },
    items: {
      type: ['blackbox']
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({collectionId, items: itemData}, viewer) {
    const collection = await Collections.findOne(collectionId)
    const itemsDB = await collection.db()
    console.log(itemData)

    // for (const item of itemData) {
    //   const itemResult = await itemsDB.findOne(item._id)
    //   if (!itemResult) continue
    //   delete item._id
    //   const $set = prependKey(item, 'data')
    //   await itemResult.update({$set})
    // }

    for (const item of itemData) {
      await itemsDB.insert({data: item})
    }

    return true
  }
})
