import {Collection} from '@orion-js/app'
import Indicator from 'app/models/Indicator'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'indicators',
  model: Indicator,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
