import Endpoints from 'app/collections/Endpoints'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    endpointId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({endpointId}, viewer) {
    await Endpoints.remove(endpointId)
    return true
  }
})
