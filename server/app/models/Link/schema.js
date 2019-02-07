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
  icon: {
    type: String,
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
    optional: true,
    custom(sizeSmall, {currentDoc}) {
      if (currentDoc.showInHome && !sizeSmall) {
        return 'required'
      }
    }
  },
  sizeMedium: {
    type: String,
    optional: true,
    custom(sizeMedium, {currentDoc}) {
      if (currentDoc.showInHome && !sizeMedium) {
        return 'required'
      }
    }
  },
  sizeLarge: {
    type: String,
    optional: true,
    custom(sizeLarge, {currentDoc}) {
      if (currentDoc.showInHome && !sizeLarge) {
        return 'required'
      }
    }
  },
  textColor: {
    type: String,
    label: 'Color del texto e icono',
    fieldType: 'colorPicker',
    fieldOptions: {defaultColor: '#181818'},
    optional: true
  },
  backgroundColor: {
    type: String,
    label: 'Color de fondo',
    fieldType: 'colorPicker',
    fieldOptions: {defaultColor: '#fff'},
    optional: true
  }
}
