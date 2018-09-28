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
    name: {
      type: String,
      label: 'Nombre'
    }
  },
  returns: Chart,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name}, viewer) {
    const chartId = await Charts.insert({
      environmentId,
      name,
      title: name,
      createdAt: new Date()
    })
    return await Charts.findOne(chartId)
  }
})
