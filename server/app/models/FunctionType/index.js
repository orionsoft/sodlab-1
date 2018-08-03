import {Model} from '@orion-js/app'

export default new Model({
  name: 'FunctionType',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
