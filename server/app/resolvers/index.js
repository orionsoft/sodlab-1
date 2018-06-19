import {ExposeSchemaResolvers} from '@orion-js/app'
import Auth from './Auth'
import Users from './Users'
import Environments from './Environments'
import Collections from './Collections'
import Forms from './Forms'
import FileManager from './FileManager'
import Views from './Views'
import Links from './Links'
import Tables from './Tables'

export default {
  ...Tables,
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
