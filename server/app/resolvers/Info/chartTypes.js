import {resolver} from '@orion-js/app'
import chartTypes from 'app/helpers/chartTypes'
import ChartType from 'app/models/ChartType'

export default resolver({
  params: {},
  returns: [ChartType],
  async resolve(params, viewer) {
    return Object.keys(chartTypes).map(_id => {
      return {
        _id,
        ...chartTypes[_id]
      }
    })
  }
})
