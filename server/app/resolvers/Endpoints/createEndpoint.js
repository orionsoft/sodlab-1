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
      label: 'Identificador',
      description: 'Identificador único',
      async custom(identifier) {
        const result = await Endpoints.findOne({
          identifier: {$regex: `^${identifier}$`, $options: 'i'}
        })
        if (result) return 'notUnique'
      }
    },
    name: {
      type: String,
      label: 'Nombre',
      description: 'Solo puede haber un endpoint con este nombre',
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
