import {Model} from '@orion-js/app'

export default new Model({
  name: 'Kpi',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
