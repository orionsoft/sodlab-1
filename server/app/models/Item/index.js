import {Model} from '@orion-js/app'

export default new Model({
  name: 'Item',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
