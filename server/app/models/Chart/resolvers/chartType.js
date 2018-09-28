import {resolver} from '@orion-js/app'
import ChartType from 'app/models/ChartType'
import chartTypes from 'app/helpers/chartTypes'

export default resolver({
  returns: ChartType,
  async resolve(chart, params, viewer) {
    return {
      _id: chart.chartTypeId,
      ...chartTypes[chart.chartTypeId]
    }
  }
})
