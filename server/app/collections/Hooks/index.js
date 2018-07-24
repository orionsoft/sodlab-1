import {Collection} from '@orion-js/app'
import Hook from 'app/models/Hook'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'hooks',
  model: Hook,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
