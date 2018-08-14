import {Collection} from '@orion-js/app'
import Role from 'app/models/Role'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'roles',
  model: Role,
  indexes: [{keys: {name: 1}, options: {collation: {locale: 'es', strength: 1}}}],
  hooks: getEnvironmentUpdatedHooks
})
