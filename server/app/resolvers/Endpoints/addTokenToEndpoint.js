import {resolver, generateId} from '@orion-js/app'
import Endpoints from 'app/collections/Endpoints'
import Endpoint from 'app/models/Endpoint'

export default resolver({
  params: {
    endpointId: {
      type: 'ID'
    }
  },
  returns: Endpoint,
  mutation: true,
  role: 'admin',
  async resolve({endpointId}, viewer) {
    const endpoint = await Endpoints.findOne(endpointId)
    const token = generateId() + generateId() + generateId()
    await endpoint.update({$push: {tokens: token}})
    return await Endpoints.findOne(endpointId)
  }
})
