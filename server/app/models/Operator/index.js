import {Model} from '@orion-js/app'

export default new Model({
  name: 'Operator',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
