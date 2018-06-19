import {Model} from '@orion-js/app'

export default new Model({
  name: 'Table',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
