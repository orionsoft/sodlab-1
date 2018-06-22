import {Model} from '@orion-js/app'

export default new Model({
  name: 'Design',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
