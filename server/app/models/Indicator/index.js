import {Model} from '@orion-js/app'

export default new Model({
  name: 'Indicator',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
