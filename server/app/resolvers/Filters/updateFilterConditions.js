import {resolver} from '@orion-js/app'
import Condition from 'app/models/Filter/Condition'
import Filters from 'app/collections/Filters'
import Filter from 'app/models/Filter'

export default resolver({
  params: {
    filterId: {
      type: 'ID'
    },
    conditions: {
      type: [
        Condition.clone({
          name: 'UpdateFilterCondition'
        })
      ]
    }
  },
  returns: Filter,
  mutation: true,
  role: 'admin',
  async resolve({filterId, conditions}, viewer) {
    const filter = await Filters.findOne(filterId)
    await filter.update({$set: {conditions}})
    return filter
  }
})
