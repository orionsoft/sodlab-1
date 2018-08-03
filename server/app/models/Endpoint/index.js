import {Model} from '@orion-js/app'

export default new Model({
  name: 'Endpoint',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
