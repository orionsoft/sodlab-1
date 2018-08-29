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
    allowedValues: ['category', 'path'],
    optional: true
  },
  path: {
    type: String,
    label: 'Ruta',
    optional: true,
    custom(path, {currentDoc}) {
      if (currentDoc.type === 'path' && !path) {
        return 'required'
      } else if (path && !path.startsWith('/')) return 'invalidPath'
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
    type: Number,
    defaultValue: 1
  },
  showInHome: {
    type: Boolean,
    optional: true
  },
  sizeSmall: {
    type: String,
    custom(sizeSmall, {currentDoc}) {
      if (currentDoc.showInHome && !sizeSmall) {
        return 'required'
      }
    }
  },
  sizeMedium: {
    type: String,
    custom(sizeMedium, {currentDoc}) {
      if (currentDoc.showInHome && !sizeMedium) {
        return 'required'
      }
    }
  },
  sizeLarge: {
    type: String,
    custom(sizeLarge, {currentDoc}) {
      if (currentDoc.showInHome && !sizeLarge) {
        return 'required'
      }
    }
  }
}
