import {Collection} from '@orion-js/app'
import Notification from 'app/models/Notification'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'notifications',
  model: Notification,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
