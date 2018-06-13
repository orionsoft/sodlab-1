import {Collection} from '@orion-js/app'
import CollectionModel from 'app/models/Collection'

export default new Collection({
  name: 'collections',
  model: CollectionModel,
  indexes: []
})
