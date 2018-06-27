import {createPaginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Chart from 'app/models/Chart'
import Charts from 'app/collections/Charts'

export default createPaginatedResolver({
  returns: Chart,
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
    return Charts.find(query)
  }
})
