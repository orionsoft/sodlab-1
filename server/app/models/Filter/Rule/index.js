import {Model} from '@orion-js/app'

export default new Model({
  name: 'FilterRule',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
