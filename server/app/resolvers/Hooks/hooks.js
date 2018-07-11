import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Hook from 'app/models/Hook'
import Hooks from 'app/collections/Hooks'

export default paginatedResolver({
  returns: Hook,
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
    return Hooks.find(query)
  }
})
