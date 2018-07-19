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
    }
  },
  async getCursor({filter, environmentId}, viewer) {
    const query = {environmentId}
    if (!viewer.roles.includes('admin')) {
      const environmentUser = await EnvironmentUsers.findOne({userId: viewer.userId, environmentId})
      query.roles = environmentUser ? {$in: environmentUser.roles} : {$in: []}
    }
    if (filter) {
      query.name = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Links.find(query).sort({title: 1})
  }
})
