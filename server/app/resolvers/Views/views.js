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
    },
    userId: {
      type: 'ID',
      optional: true
    }
  },
  async getCursor({filter, environmentId, userId}, viewer) {
    const query = {environmentId}
    if (!viewer.roles.includes('admin')) {
      if (userId) {
        const environmentUser = await EnvironmentUsers.findOne({userId})
        query.roles = {$in: environmentUser.roles}
      }
    }
    if (filter) {
      query.path = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Views.find(query)
  }
})
