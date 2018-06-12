import {ExposeSchemaResolvers} from '@orion-js/app'
import Auth from './Auth'
import Users from './Users'

export default {
  ...ExposeSchemaResolvers,
  ...Auth,
  ...Users
}
