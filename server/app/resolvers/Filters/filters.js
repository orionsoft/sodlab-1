import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'

export default paginatedResolver({
  returns: Filter,
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
    return Filters.find(query)
  }
})
