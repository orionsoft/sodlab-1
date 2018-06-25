import {Model} from '@orion-js/app'

export default new Model({
  name: 'TableField',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
