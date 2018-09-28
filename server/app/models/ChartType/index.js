import {Model} from '@orion-js/app'

export default new Model({
  name: 'ChartType',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
