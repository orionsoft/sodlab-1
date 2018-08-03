import Endpoints from 'app/collections/Endpoints'
import {resolver} from '@orion-js/app'
import Endpoint from 'app/models/Endpoint'

export default resolver({
  params: {
    endpointId: {
      type: 'ID'
    },
    endpoint: {
      type: Endpoint.clone({
        name: 'UpdateEndpoint',
        omitFields: ['_id', 'environmentId', 'createdAt', 'collectionId']
      })
    }
  },
  returns: Endpoint,
  mutation: true,
  role: 'admin',
  async resolve({endpointId, endpoint: endpointData}, viewer) {
    const endpoint = await Endpoints.findOne(endpointId)
    await endpoint.update({$set: endpointData})
    return endpoint
  }
})
