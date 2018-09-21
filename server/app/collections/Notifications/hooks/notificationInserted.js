import {hook} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import Notifications from 'app/collections/Notifications'
import notificationInserted from 'app/subscriptions/Environments/notificationInserted'

export default hook('after.insert', async function(selector) {
  console.log({selector})
  return selector
  // const notification = await Notifications.findOne(selector)
  // await notificationInserted({notificationId: notification._id}, notification)

  //   import {resolver, hook} from '@orion-js/app'
  //   import notificationInserted from 'app/subscriptions/Environments/notificationInserted'
  //   import EnvironmentUsers from 'app/collections/EnvironmentUsers'
  // import Notifications from 'app/collections/Notifications'
  //
  //   export default resolver({
  //     private: true,
  //     async resolve(notification, params, viewer) {
  //       const environmentUser = await EnvironmentUsers.findOne({
  //         userId: viewer.userId,
  //         environmentId: notification.environmentId
  //       })
  //       const roles = environmentUser.roles.length ? environmentUser.roles : []
  //       console.log({roles})
  //       const types = ['after.insert']
  //       return types.map(type => {
  //         return hook(type, function() {
  //           notificationInserted(
  //             {
  //               environmentId: notification.environmentId,
  //               roles: roles
  //             },
  //             type.replace('after.')
  //           )
  //         })
  //       })
  //     }
  //   })

  // const environment = await Environments.findOne(selector)
  // await environmentUpdated({environmentId: environment._id}, new Date())
})
