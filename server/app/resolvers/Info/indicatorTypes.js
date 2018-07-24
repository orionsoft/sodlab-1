import {resolver} from '@orion-js/app'
import indicatorTypes from 'app/helpers/indicatorTypes'
import IndicatorType from 'app/models/IndicatorType'

export default resolver({
  params: {},
  returns: [IndicatorType],
  async resolve(params, viewer) {
    return Object.keys(indicatorTypes).map(_id => {
      return {
        _id,
        ...indicatorTypes[_id]
      }
    })
  }
})
