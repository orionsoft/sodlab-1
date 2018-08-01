import {resolver} from '@orion-js/app'
import Collections from 'app/collections/Collections'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    },
    elementId: {
      type: 'ID'
    }
  },
  returns: 'blackbox',
  async resolve({collectionId, elementId}, viewer) {
    const collection = await Collections.findOne(collectionId)
    if (!collection) throw new Error('collection not found')

    const collectionDB = await collection.db()
    const collectionDoc = await collectionDB.findOne(elementId)
    return collectionDoc
  }
})
