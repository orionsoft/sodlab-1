import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Indicator from 'app/models/Indicator'
import Indicators from 'app/collections/Indicators'

export default paginatedResolver({
  returns: Indicator,
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

    return Indicators.find(query).sort({name: 1})
  }
})
