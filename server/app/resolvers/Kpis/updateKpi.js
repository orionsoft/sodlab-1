import {resolver} from '@orion-js/app'
import Kpi from 'app/models/Kpi'
import Kpis from 'app/collections/Kpis'

export default resolver({
  params: {
    kpiId: {
      type: 'ID'
    },
    kpi: {
      type: Kpi.clone({
        name: 'UpdateKpi',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Kpi,
  mutation: true,
  role: 'admin',
  async resolve({kpiId, kpi: kpiData}, viewer) {
    const kpi = await Kpis.findOne(kpiId)
    await kpi.update({$set: kpiData})
    return kpi
  }
})
