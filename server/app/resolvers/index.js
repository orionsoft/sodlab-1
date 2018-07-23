import {resolversSchemas} from '@orion-js/graphql'
import Auth from './Auth'
import Users from './Users'
import Environments from './Environments'
import Collections from './Collections'
import Forms from './Forms'
import FileManager from './FileManager'
import Views from './Views'
import Links from './Links'
import Tables from './Tables'
import Roles from './Roles'
import Charts from './Charts'
import Filters from './Filters'
import Hooks from './Hooks'
import Info from './Info'
import EnvironmentUsers from './EnvironmentUsers'
import Indicators from './Indicators'

export default {
  ...EnvironmentUsers,
  ...Hooks,
  ...Filters,
  ...Charts,
  ...Info,
  ...Tables,
  ...Links,
  ...Views,
  ...FileManager,
  ...Forms,
  ...Collections,
  ...Environments,
  ...resolversSchemas,
  ...Auth,
  ...Users,
  ...Roles,
  ...Indicators
}
