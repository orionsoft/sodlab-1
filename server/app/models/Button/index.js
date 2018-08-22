import {Model} from '@orion-js/app'

export default new Model({
  name: 'Button',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
