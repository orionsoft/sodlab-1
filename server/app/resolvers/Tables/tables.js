import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Table from 'app/models/Table'
import Tables from 'app/collections/Tables'

export default paginatedResolver({
  returns: Table,
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
      query.title = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Tables.find(query)
  }
})
