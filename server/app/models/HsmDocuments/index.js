import {Model} from '@orion-js/app'

export default new Model({
  name: 'HsmDocuments',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
