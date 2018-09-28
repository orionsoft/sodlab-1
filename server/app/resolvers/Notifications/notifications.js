import {paginatedResolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Notifications from 'app/collections/Notifications'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import Notification from 'app/models/Notification'

export default paginatedResolver({
  returns: Notification,
  params: {
    filter: {
      type: String,
      optional: true
    },
    environmentId: {
      type: 'ID'
    },
    environmentUserId: {
      type: 'ID',
      optional: true
    }
  },
  async getCursor({filter, environmentId, environmentUserId, readed}, viewer) {
    const query = {environmentId, notifierId: {$ne: environmentUserId}}

    const environmentUser = await EnvironmentUsers.findOne(environmentUserId)
    const {roles} = environmentUser

    if (filter) {
      query.name = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    if (roles.length) {
      query.roles = {$in: roles}
    }

    return Notifications.find(query).sort({createdAt: -1})
  }
})
