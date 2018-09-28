import {resolver} from '@orion-js/app'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import notificationInserted from 'app/subscriptions/Environments/notificationInserted'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    },
    notificationId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({environmentId, notificationId}, viewer) {
    const environmentUser = await EnvironmentUsers.findOne({environmentId, userId: viewer.userId})
    const readedNotifications = environmentUser.readedNotifications || []
    readedNotifications.push(notificationId)
    await environmentUser.update({$set: {readedNotifications}})
    await notificationInserted({environmentId: environmentUser.environmentId}, 'notification')
    return true
  }
})
