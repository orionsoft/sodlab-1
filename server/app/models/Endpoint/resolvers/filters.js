import {resolver} from '@orion-js/app'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'

export default resolver({
  returns: [Filter],
  async resolve(table, params, viewer) {
    if (!table.filtersIds || !table.filtersIds.length) return []
    return await Filters.find({_id: {$in: table.filtersIds}}).toArray()
  }
})
