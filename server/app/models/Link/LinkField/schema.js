export default {
  title: {
    type: String,
    label: 'Titulo'
  },
  path: {
    type: String,
    label: 'Ruta',
    custom(path) {
      if (!path.startsWith('/')) return 'invalidPath'
    }
  },
  icon: {
    type: String,
    optional: true
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
  roles: {
    type: ['ID'],
    defaultValue: []
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
