import {resolver} from '@orion-js/app'
import Kpi from 'app/models/Kpi'
import Kpis from 'app/collections/Kpis'

export default resolver({
  params: {
    kpiId: {
      type: 'ID'
    }
  },
  returns: Kpi,
  async resolve({kpiId}, viewer) {
    return await Kpis.findOne(kpiId)
  }
})
