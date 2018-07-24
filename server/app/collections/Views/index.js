import {Collection} from '@orion-js/app'
import View from 'app/models/View'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'views',
  model: View,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
