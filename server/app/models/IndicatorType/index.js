import {Model} from '@orion-js/app'

export default new Model({
  name: 'IndicatorType',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
