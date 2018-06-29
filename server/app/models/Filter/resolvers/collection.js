import {resolver} from '@orion-js/app'
import Collection from 'app/models/Collection'
import Collections from 'app/collections/Collections'

export default resolver({
  returns: Collection,
  async resolve(filter, params, viewer) {
    return await Collections.findOne(filter.collectionId)
  }
})
