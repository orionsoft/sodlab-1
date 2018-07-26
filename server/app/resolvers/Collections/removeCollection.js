import Collections from 'app/collections/Collections'
import {resolver} from '@orion-js/app'
import postRemoveCollection from 'app/helpers/resolvers/collections/postRemoveCollection'

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
    console.log(collectionId)
    await postRemoveCollection(collectionId)
    await Collections.remove(collectionId)
    return true
  }
})
