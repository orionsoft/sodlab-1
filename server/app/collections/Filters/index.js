import {Collection} from '@orion-js/app'
import Filter from 'app/models/Filter'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'filters',
  model: Filter,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
