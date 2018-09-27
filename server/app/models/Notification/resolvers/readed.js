import {resolver} from '@orion-js/app'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  returns: Boolean,
  async resolve(notification, params, viewer) {
    const environmentUser = await EnvironmentUsers.findOne({
      environmentId: notification.environmentId,
      userId: viewer.userId
    })
    if (
      environmentUser.readedNotifications &&
      environmentUser.readedNotifications.includes(notification._id)
    ) {
      return true
    }
    return false
  }
})
