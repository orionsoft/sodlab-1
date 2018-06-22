import {createPaginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Design from 'app/models/Design'
import Designs from 'app/collections/Designs'

export default createPaginatedResolver({
  returns: Design,
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
    return Designs.find(query)
  }
})
