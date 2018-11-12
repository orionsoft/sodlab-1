import Collections from 'app/collections/Collections'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'superAdmin',
  async resolve({collectionId}, viewer) {
    const collection = await Collections.findOne(collectionId)
    const collectionDB = await collection.db()
    await collectionDB.remove({})
    return true
  }
})
