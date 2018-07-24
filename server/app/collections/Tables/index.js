import {Collection} from '@orion-js/app'
import Table from 'app/models/Table'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'tables',
  model: Table,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
