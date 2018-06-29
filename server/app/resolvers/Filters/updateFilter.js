import {resolver} from '@orion-js/app'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'

export default resolver({
  params: {
    filterId: {
      type: 'ID'
    },
    filter: {
      type: Filter.clone({
        name: 'UpdateFilterBasic',
        pickFields: ['name']
      })
    }
  },
  returns: Filter,
  mutation: true,
  role: 'admin',
  async resolve({filterId, filter: filterData}, viewer) {
    const filter = await Filters.findOne(filterId)
    await filter.update({$set: filterData})
    return filter
  }
})
