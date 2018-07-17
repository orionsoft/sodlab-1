import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Link from 'app/models/Link'
import Links from 'app/collections/Links'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default paginatedResolver({
  returns: Link,
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
      query.name = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Links.find(query)
  }
})
