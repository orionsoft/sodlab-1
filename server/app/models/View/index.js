import {Model} from '@orion-js/app'

export default new Model({
  name: 'View',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
