import {paginatedResolver} from '@orion-js/app'
import Environment from 'app/models/Environment'
import Environments from 'app/collections/Environments'
import Users from 'app/collections/Users'
import escape from 'escape-string-regexp'

export default paginatedResolver({
  returns: Environment,
  params: {
    filter: {
      type: String,
      optional: true
    }
  },
  async getCursor({filter}, viewer) {
    const query = {}
    const user = await Users.findOne(viewer.userId)
    if (viewer.roles && !viewer.roles.includes('superAdmin')) {
      query._id = {$in: user.environmentsAuthorized}
    }
    if (filter) {
      query._id = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    return Environments.find(query)
  }
})
