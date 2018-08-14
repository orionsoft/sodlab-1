import {Model} from '@orion-js/app'

export default new Model({
  name: 'Validation',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
