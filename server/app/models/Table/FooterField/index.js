import {Model} from '@orion-js/app'

export default new Model({
  name: 'FooterField',
  schema: () => require('./schema'),
  resolvers: () => require('./resolvers')
})
