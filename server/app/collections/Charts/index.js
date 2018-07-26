import {Collection} from '@orion-js/app'
import Chart from 'app/models/Chart'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'charts',
  model: Chart,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
