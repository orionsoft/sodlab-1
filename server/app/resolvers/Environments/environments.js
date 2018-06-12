import {createPaginatedResolver} from '@orion-js/app'
import Environment from 'app/models/Environment'
import Environments from 'app/collections/Environments'
import escape from 'escape-string-regexp'

export default createPaginatedResolver({
  returns: Environment,
  params: {
    filter: {
      type: String,
      optional: true
    }
  },
  async getCursor({filter}, viewer) {
    const query = {}
    if (filter) {
      query._id = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Environments.find(query)
  }
})
