import {hook} from '@orion-js/app'
import Notifications from 'app/collections/Notifications'
import notificationInserted from 'app/subscriptions/Environments/notificationInserted'

export default hook('after.insert', async function(selector) {
  const notification = await Notifications.findOne(selector)
  await notificationInserted({environmentId: notification.environmentId}, 'notification')
})
