import {Model} from '@orion-js/app'

export default new Model({
  name: 'FormField',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
