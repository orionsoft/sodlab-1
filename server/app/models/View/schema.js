import ViewItem from './ViewItem'

export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  path: {
    type: String,
    label: 'Ruta',
    custom(path) {
      if (!path.startsWith('/')) return 'invalid'
    }
  },
  name: {
    type: String,
    label: 'Nombre'
  },
  createdAt: {
    type: Date
  },
  items: {
    label: 'Items',
    type: [ViewItem],
    optional: true
  }
}
