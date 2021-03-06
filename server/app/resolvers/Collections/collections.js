import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Collection from 'app/models/Collection'
import Collections from 'app/collections/Collections'

export default paginatedResolver({
  returns: Collection,
  params: {
    filter: {
      type: String,
      optional: true
    },
    environmentId: {
      type: 'ID'
    }
  },
  async getCursor({filter, environmentId}, viewer) {
    const query = {environmentId}
    if (filter) {
      query._id = {$regex: new RegExp(`^${escape(filter)}`)}
    }

    return await Collections.find(query).sort({name: 1})
  }
})
