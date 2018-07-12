import {resolver} from '@orion-js/app'
import Kpi from 'app/models/Kpi'
import Kpis from 'app/collections/Kpis'
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
    },
    title: {
      type: String,
      label: 'Título'
    }
  },
  returns: Kpi,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name, title}, viewer) {
    const kpiId = await Kpis.insert({
      environmentId,
      name,
      title,
      createdAt: new Date()
    })
    return await Kpis.findOne(kpiId)
  }
})
