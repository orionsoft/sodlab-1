import {Model} from '@orion-js/app'

export default new Model({
  name: 'Hook',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
