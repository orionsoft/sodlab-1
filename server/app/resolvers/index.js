import {ExposeSchemaResolvers} from '@orion-js/app'
import Auth from './Auth'
import Users from './Users'
import Environments from './Environments'
import Collections from './Collections'
import Forms from './Forms'
import FileManager from './FileManager'

export default {
  ...FileManager,
  ...Forms,
  ...Collections,
  ...Environments,
  ...ExposeSchemaResolvers,
  ...Auth,
  ...Users
}
