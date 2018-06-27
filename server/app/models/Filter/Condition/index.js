import {Model} from '@orion-js/app'

export default new Model({
  name: 'FilterCondition',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
