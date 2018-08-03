import isEmpty from 'lodash/isEmpty'

export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  identifier: {
    type: String,
    label: 'Título'
  },
  name: {
    type: String,
    label: 'Nombre'
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
