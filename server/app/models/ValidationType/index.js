import {Model} from '@orion-js/app'

export default new Model({
  name: 'ValidationType',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
