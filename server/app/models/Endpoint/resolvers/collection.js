import {resolver} from '@orion-js/app'
import Collection from 'app/models/Collection'
import Collections from 'app/collections/Collections'

export default resolver({
  returns: Collection,
  async resolve(table, params, viewer) {
    return await Collections.findOne(table.collectionId)
  }
})
