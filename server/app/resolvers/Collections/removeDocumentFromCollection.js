import {resolver} from '@orion-js/app'
import Collections from 'app/collections/Collections'

export default resolver({
  params: {
    collectionId: {
      type: String
    },
    elementId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({collectionId, elementId}, viewer) {
    const collection = await Collections.findOne(collectionId)
    if (!collection) throw new Error('collection not found')

    const collectionDB = await collection.db()
    await collectionDB.remove(elementId)
    return true
  }
})
