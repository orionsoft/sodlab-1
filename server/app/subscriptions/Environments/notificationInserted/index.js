import {subscription} from '@orion-js/graphql'
import Notification from 'app/models/Notification'

export default subscription({
  params: {
    notificationId: {
      type: 'ID'
    }
  },
  returns: Notification
})
