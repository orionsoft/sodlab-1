import {resolver} from '@orion-js/app'
import Collection from 'app/models/Collection'
import Collections from 'app/collections/Collections'

export default resolver({
  params: {
    collectionId: {
      type: 'ID'
    }
  },
  returns: Collection,
  async resolve({collectionId}, viewer) {
    return await Collections.findOne(collectionId)
  }
})
