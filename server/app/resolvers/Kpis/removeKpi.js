import {resolver} from '@orion-js/app'
import Kpis from 'app/collections/Kpis'

export default resolver({
  params: {
    kpiId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({kpiId}, viewer) {
    await Kpis.remove(kpiId)
    return true
  }
})
