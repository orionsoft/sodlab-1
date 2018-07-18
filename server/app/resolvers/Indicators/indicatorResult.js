import {resolver} from '@orion-js/app'
import Indicators from 'app/collections/Indicators'
import Filters from 'app/collections/Filters'

export default resolver({
  params: {
    indicatorId: {
      type: 'ID'
    },
    filterId: {
      type: 'ID',
      optional: true
    },
    filterOptions: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: 'blackbox',
  async resolve({indicatorId, filterId, filterOptions}, viewer) {
    const indicator = await Indicators.findOne(indicatorId)
    if (!filterId && !indicator.allowsNoFilter) throw new Error('Filter is required')
    const query = filterId
      ? await (await Filters.findOne(filterId)).createQuery({filterOptions}, viewer)
      : {}
    console.log(query)

    return 123
  }
})
