import {createPaginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Role from 'app/models/Role'
import Roles from 'app/collections/Roles'

export default createPaginatedResolver({
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
      query._id = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Roles.find(query)
  }
})
