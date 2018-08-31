import {Model} from '@orion-js/app'

export default new Model({
  name: 'LinkField',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
