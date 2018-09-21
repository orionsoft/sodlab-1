import {Collection} from '@orion-js/app'
import Notification from 'app/models/Notification'

export default new Collection({
  name: 'notifications',
  model: Notification,
  indexes: [],
  hooks: () => require('./hooks')
})
