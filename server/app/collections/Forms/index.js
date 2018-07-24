import {Collection} from '@orion-js/app'
import Form from 'app/models/Form'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'forms',
  model: Form,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
