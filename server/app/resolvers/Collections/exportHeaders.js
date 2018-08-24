import {resolver} from '@orion-js/app'
import Collections from 'app/collections/Collections'
import exportHeaders from 'app/helpers/resolvers/tables/exportHeaders'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    }
  },
  returns: 'blackbox',
  mutation: true,
  role: 'admin',
  async resolve({collectionId}, viewer) {
    const collection = await Collections.findOne(collectionId)
    if (!collection) throw new Error('collection not found')
    const file = await exportHeaders(collection.fields)
    return await file
  }
})
