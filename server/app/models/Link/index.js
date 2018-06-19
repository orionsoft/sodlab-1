import {Model} from '@orion-js/app'

export default new Model({
  name: 'Link',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
