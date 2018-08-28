export default {
  title: {
    type: String
  },
  path: {
    type: String,
    label: 'Ruta',
    custom(path) {
      if (!path.startsWith('/')) return 'invalidPath'
    }
  }
}
