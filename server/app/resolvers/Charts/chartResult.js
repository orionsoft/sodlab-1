import {resolver} from '@orion-js/app'
import Charts from 'app/collections/Charts'

export default resolver({
  params: {
    chartId: {
      type: 'ID'
    },
    filterId: {
      type: 'ID',
      optional: true
    },
    filterOptions: {
      type: 'blackbox',
      optional: true
    },
    params: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: 'blackbox',
  async resolve({chartId, filterId, filterOptions, params}, viewer) {
    const chart = await Charts.findOne(chartId)
    const data = await chart.getData({filterId, filterOptions, params})
    return data
  }
})
