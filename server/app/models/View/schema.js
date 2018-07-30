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
      if (!path.startsWith('/')) return 'invalidPath'
    }
  },
  name: {
    type: String,
    label: 'Nombre'
  },
  title: {
    type: String,
    label: 'Título',
    optional: true
  },
  createdAt: {
    type: Date
  },
  items: {
    label: 'Items',
    type: [ViewItem],
    optional: true
  },
  roles: {
    type: ['ID'],
    defaultValue: []
  }
}
