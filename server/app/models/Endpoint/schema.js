import Endpoints from 'app/collections/Endpoints'

export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  identifier: {
    type: String,
    label: 'Título',
    description: 'Identificador único',
    async custom(identifier, {doc}) {
      if (doc.endpointId) {
        const endpoint = await Endpoints.findOne(doc.endpointId)
        const result = await Endpoints.findOne({
          identifier: {$regex: `^${identifier}$`, $options: 'i'}
        })
        if (result && endpoint._id !== result._id) return 'notUnique'
      }
    }
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber una tabla con este nombre',
    async custom(name, {doc}) {
      if (doc.endpointId) {
        const endpoint = await Endpoints.findOne(doc.endpointId)
        const result = await Endpoints.findOne({
          name: {$regex: `^${name}$`, $options: 'i'}
        })
        if (result && endpoint._id !== result._id) return 'notUnique'
      }
    }
  },
  createdAt: {
    type: Date
  },
  collectionId: {
    type: 'ID'
  },
  password: {
    type: String,
    label: 'Contraseña',
    optional: true
  },
  filterId: {
    type: String,
    optional: true
  }
}
