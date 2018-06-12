import {ExposeSchemaResolvers} from '@orion-js/app'
import Auth from './Auth'
import Users from './Users'
import Environments from './Environments'

export default {
  ...Environments,
  ...ExposeSchemaResolvers,
  ...Auth,
  ...Users
}
