import {resolver} from '@orion-js/app'
import Chart from 'app/models/Chart'
import Charts from 'app/collections/Charts'

export default resolver({
  params: {
    chartId: {
      type: 'ID'
    }
  },
  returns: Chart,
  async resolve({chartId}, viewer) {
    return await Charts.findOne(chartId)
  }
})
