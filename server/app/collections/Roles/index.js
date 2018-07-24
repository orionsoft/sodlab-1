import {Collection} from '@orion-js/app'
import Role from 'app/models/Role'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'roles',
  model: Role,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
