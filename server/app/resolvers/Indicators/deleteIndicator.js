import {resolver} from '@orion-js/app'
import Indicators from 'app/collections/Indicators'

export default resolver({
  params: {
    indicatorId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({indicatorId}, viewer) {
    await Indicators.remove(indicatorId)
    return true
  }
})
