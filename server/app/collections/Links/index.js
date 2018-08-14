import {Collection} from '@orion-js/app'
import Link from 'app/models/Link'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'links',
  model: Link,
  indexes: [{keys: {title: 1}, options: {collation: {locale: 'es', strength: 1}}}],
  hooks: getEnvironmentUpdatedHooks
})
