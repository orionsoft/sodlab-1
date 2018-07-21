import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import EnvironmentUser from 'app/models/EnvironmentUser'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default paginatedResolver({
  returns: EnvironmentUser,
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
      query.email = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return EnvironmentUsers.find(query).sort({email: 1})
  }
})
