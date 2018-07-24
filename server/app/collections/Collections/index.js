import {Collection} from '@orion-js/app'
import CollectionModel from 'app/models/Collection'
import getEnvironmentUpdatedHooks from 'app/helpers/misc/getEnvironmentUpdatedHooks'

export default new Collection({
  name: 'collections',
  model: CollectionModel,
  indexes: [],
  hooks: getEnvironmentUpdatedHooks
})
