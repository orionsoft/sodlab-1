import {Collection} from '@orion-js/app'
import Button from 'app/models/Button'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'buttons',
  model: Button,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
