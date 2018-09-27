import {Model} from '@orion-js/app'

export default new Model({
  name: 'Notification',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
