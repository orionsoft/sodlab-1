import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import View from 'app/models/View'
import Views from 'app/collections/Views'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default paginatedResolver({
  returns: View,
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
    if (!viewer.roles.includes('admin')) {
      const environmentUser = await EnvironmentUsers.findOne({userId: viewer.userId, environmentId})
      query.roles = environmentUser ? {$in: environmentUser.roles} : {$in: []}
    }
    if (filter) {
      query.path = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Views.find(query)
  }
})
