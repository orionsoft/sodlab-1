import {ExposeSchemaResolvers} from '@orion-js/app'
import Auth from './Auth'
import Users from './Users'
import Environments from './Environments'
import Collections from './Collections'
import Forms from './Forms'
import FileManager from './FileManager'
import Views from './Views'
import Links from './Links'

export default {
  ...Links,
  ...Views,
  ...FileManager,
  ...Forms,
  ...Collections,
  ...Environments,
  ...ExposeSchemaResolvers,
  ...Auth,
  ...Users
}
