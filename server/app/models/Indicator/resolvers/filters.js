import {resolver} from '@orion-js/app'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'

export default resolver({
  returns: [Filter],
  async resolve(indicator, params, viewer) {
    if (!indicator.filtersIds || !indicator.filtersIds.length) return []
    return await Filters.find({_id: {$in: indicator.filtersIds}}).toArray()
  }
})
