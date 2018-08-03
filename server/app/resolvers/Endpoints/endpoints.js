import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Endpoint from 'app/models/Endpoint'
import Endpoints from 'app/collections/Endpoints'

export default paginatedResolver({
  returns: Endpoint,
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
      query.name = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Endpoints.find(query).sort({name: 1})
  }
})
