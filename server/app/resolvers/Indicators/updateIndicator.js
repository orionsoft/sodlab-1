import {resolver} from '@orion-js/app'
import Indicator from 'app/models/Indicator'
import Indicators from 'app/collections/Indicators'

export default resolver({
  params: {
    indicatorId: {
      type: 'ID'
    },
    indicator: {
      type: Indicator.clone({
        name: 'UpdateIndicator',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Indicator,
  mutation: true,
  role: 'admin',
  async resolve({indicatorId, indicator: indicatorData}, viewer) {
    const indicator = await Indicators.findOne(indicatorId)
    await indicator.update({$set: indicatorData})
    return indicator
  }
})
