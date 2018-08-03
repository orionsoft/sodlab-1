import {resolver} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import Endpoints from 'app/collections/Endpoints'
import Endpoint from 'app/models/Endpoint'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    collectionId: {
      type: 'ID'
    },
    identifier: {
      type: String,
      label: 'Identificador'
    },
    name: {
      type: String,
      label: 'Nombre',
      description: 'Solo puede haber una tabla con este nombre',
      async custom(name) {
        const result = await Endpoints.findOne({name: {$regex: `^${name}$`, $options: 'i'}})
        if (result) return 'notUnique'
      }
    }
  },
  returns: Endpoint,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, collectionId, identifier, name}, viewer) {
    const endpointId = await Endpoints.insert({
      environmentId,
      collectionId,
      identifier,
      name,
      createdAt: new Date()
    })
    return await Endpoints.findOne(endpointId)
  }
})
