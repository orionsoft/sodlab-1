import {resolver} from '@orion-js/app'
import Endpoint from 'app/models/Endpoint'
import Endpoints from 'app/collections/Endpoints'

export default resolver({
  params: {
    endpointId: {
      type: 'ID'
    }
  },
  returns: Endpoint,
  async resolve({endpointId}, viewer) {
    return await Endpoints.findOne(endpointId)
  }
})
