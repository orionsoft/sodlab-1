export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  roles: {
    type: ['ID'],
    defaultValue: []
  },
  title: {
    type: String
  },
  content: {
    type: String,
    optional: true
  },
  path: {
    type: String,
    label: 'Ruta',
    optional: true,
    custom(path, {currentDoc}) {
      if (path && !path.startsWith('/')) return 'invalidPath'
    }
  },
  readed: {
    type: Boolean,
    defaultValue: false
  },
  createdAt: {
    type: Date
  }
}
