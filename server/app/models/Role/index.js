import {Model} from '@orion-js/app'

export default new Model({
  name: 'Role',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
