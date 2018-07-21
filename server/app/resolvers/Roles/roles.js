import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Role from 'app/models/Role'
import Roles from 'app/collections/Roles'

export default paginatedResolver({
  returns: Role,
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
    return Roles.find(query).sort({name: 1})
  }
})
