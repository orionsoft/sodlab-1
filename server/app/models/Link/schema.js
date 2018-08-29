import LinkField from './LinkField'
export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  title: {
    type: String,
    label: 'Titulo'
  },
  type: {
    type: String,
    allowedValues: ['category', 'path']
  },
  path: {
    type: String,
    label: 'Ruta',
    optional: true,
    custom(path, {currentDoc}) {
      if (currentDoc.type === 'path' && !path) {
        return 'required'
      } else if (!path.startsWith('/')) return 'invalidPath'
    }
  },
  fields: {
    label: 'Links',
    type: [LinkField],
    defaultValue: [],
    optional: true,
    custom(fields, {currentDoc}) {
      if (currentDoc.type === 'category' && !fields) {
        return 'required'
      }
    }
  },
  createdAt: {
    type: Date
  },
  roles: {
    type: ['ID'],
    defaultValue: []
  },
  position: {
    type: Number
  }
}
