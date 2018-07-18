import {resolver} from '@orion-js/app'
import Indicator from 'app/models/Indicator'
import Indicators from 'app/collections/Indicators'

export default resolver({
  params: {
    indicatorId: {
      type: 'ID'
    }
  },
  returns: Indicator,
  async resolve({indicatorId}, viewer) {
    return await Indicators.findOne(indicatorId)
  }
})
