import {resolver} from '@orion-js/app'
import Chart from 'app/models/Chart'
import Charts from 'app/collections/Charts'

export default resolver({
  params: {
    chartId: {
      type: 'ID'
    },
    chart: {
      type: Chart.clone({
        name: 'UpdateChart',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Chart,
  mutation: true,
  role: 'admin',
  async resolve({chartId, chart: chartData}, viewer) {
    const chart = await Charts.findOne(chartId)
    await chart.update({$set: chartData})
    return chart
  }
})
