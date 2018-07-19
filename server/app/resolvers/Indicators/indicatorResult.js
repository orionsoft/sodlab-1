import {resolver} from '@orion-js/app'
import Indicators from 'app/collections/Indicators'

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
    const result = await indicator.result({filterId, filterOptions}, viewer)
    return result
  }
})
