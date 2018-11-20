import {Model} from '@orion-js/app'

export default new Model({
  name: 'HsmRequests',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
