import {resolver} from '@orion-js/app'
import Filter from 'app/models/Filter'
import Filters from 'app/collections/Filters'

export default resolver({
  params: {
    filterId: {
      type: 'ID'
    }
  },
  returns: Filter,
  async resolve({filterId}, viewer) {
    return await Filters.findOne(filterId)
  }
})
