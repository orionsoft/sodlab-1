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
    if (
      !viewer.roles ||
      (!viewer.roles.includes('superAdmin') && !viewer.roles.includes('admin'))
    ) {
      throw new Error(`No tienes permisos`)
    }

    if (viewer.roles.includes('superAdmin')) {
      if (filter) {
        query._id = {$regex: new RegExp(`^${escape(filter)}`)}
      }
    } else if (viewer.roles.includes('admin')) {
      const admin = await Users.findOne(viewer.userId)
      const environments = {$in: admin.environmentsAuthorized || []}
      query._id = filter
        ? {...environments, ...{$regex: new RegExp(`^${escape(filter)}`)}}
        : environments
    }

    return Environments.find(query)
  }
})
