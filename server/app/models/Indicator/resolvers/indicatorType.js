import {resolver} from '@orion-js/app'
import IndicatorType from 'app/models/IndicatorType'
import indicatorTypes from 'app/helpers/indicatorTypes'

export default resolver({
  returns: IndicatorType,
  async resolve(indicator, params, viewer) {
    for (const _id of Object.keys(indicatorTypes)) {
      if (_id === indicator.indicatorTypeId) {
        return {
          _id,
          ...indicatorTypes[_id]
        }
      }
    }
  }
})
