export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  title: {
    type: String,
    label: 'Nombre'
  },
  path: {
    type: String,
    label: 'Ruta',
    custom(path) {
      if (!path.startsWith('/')) return 'invalidPath'
    }
  },
  createdAt: {
    type: Date
  }
}