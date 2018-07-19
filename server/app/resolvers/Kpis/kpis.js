import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Kpi from 'app/models/Kpi'
import Kpis from 'app/collections/Kpis'

export default paginatedResolver({
  returns: Kpi,
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
    return Kpis.find(query).sort({title: 1})
  }
})
