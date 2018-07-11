import {Model} from '@orion-js/app'

export default new Model({
  name: 'Field',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
