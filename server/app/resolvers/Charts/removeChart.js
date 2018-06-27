import {resolver} from '@orion-js/app'
import Charts from 'app/collections/Charts'

export default resolver({
  params: {
    chartId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({chartId}, viewer) {
    await Charts.remove(chartId)
    return true
  }
})
