import {resolver} from '@orion-js/app'
import Endpoints from 'app/collections/Endpoints'
import Endpoint from 'app/models/Endpoint'

export default resolver({
  params: {
    endpointId: {
      type: 'ID'
    },
    token: {
      type: String
    }
  },
  returns: Endpoint,
  mutation: true,
  role: 'admin',
  async resolve({endpointId, token}, viewer) {
    const endpoint = await Endpoints.findOne(endpointId)
    await endpoint.update({$pull: {tokens: token}})
    return await Endpoints.findOne(endpointId)
  }
})
