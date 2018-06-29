import {Collection} from '@orion-js/app'
import Filter from 'app/models/Filter'

export default new Collection({
  name: 'filters',
  model: Filter,
  indexes: []
})
