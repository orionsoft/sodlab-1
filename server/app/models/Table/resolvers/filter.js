import {resolver} from '@orion-js/app'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'

export default resolver({
  returns: Filter,
  async resolve(table, params, viewer) {
    return await Filters.findOne(table.filterId)
  }
})
