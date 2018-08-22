import {resolver} from '@orion-js/app'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'

export default resolver({
  returns: [Filter],
  async resolve(indicator, params, viewer) {
    if (!indicator.filtersIds || !indicator.filtersIds.length) return []
    const filters = indicator.orderFiltersByName
      ? await Filters.find({_id: {$in: indicator.filtersIds}})
        .sort({title: 1})
        .toArray()
      : Promise.all(
        indicator.filtersIds.map(async filterId => {
          return await Filters.findOne(filterId)
        })
      )
    return filters
  }
})
