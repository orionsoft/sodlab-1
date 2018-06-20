import {resolver} from '@orion-js/app'
import Chart from 'app/models/Chart'
import Charts from 'app/collections/Charts'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    title: {
      type: String,
      label: 'Título'
    }
  },
  returns: Chart,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, title}, viewer) {
    const chartId = await Charts.insert({
      environmentId,
      title,
      createdAt: new Date()
    })
    return await Charts.findOne(chartId)
  }
})
