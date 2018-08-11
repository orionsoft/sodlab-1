import {File} from '@orion-js/file-manager'
import Field from 'app/models/Field'

export default {
  _id: {
    type: 'ID',
    max: 12,
    custom(id) {
      if (!/^[a-z0-9-_]+$/g.test(id)) return 'invalid'
    }
  },
  name: {
    type: String,
    label: 'Nombre'
  },
  createdAt: {
    type: Date
  },
  url: {
    type: String,
    label: 'URL para acceder al ambiente',
    description: 'No incluir ni http',
    custom(url) {
      if (!url) return
      // es tipo localhost:3010
      if (url.includes(':30')) {
      } else if (/https?:.*/.test(url)) {
        return 'invalid'
      } else if (!url.includes('.')) {
        return 'invalid'
      }
    }
  },
  logo: {
    type: File,
    fileType: 'image',
    label: 'Logo',
    optional: true
  },
  authBackgroundImage: {
    type: File,
    label: 'Imagen de fondo en el Login',
    fileType: 'image',
    optional: true
  },
  fontName: {
    type: String,
    optional: true,
    label: 'Tipografía',
    allowedValues: ['Roboto', 'Open Sans', 'Lato']
  },
  profileFields: {
    type: [Field],
    defaultValue: [],
    optional: true
  },
  liorenId: {
    type: String,
    label: 'Lioren ID',
    optional: true
  }
}
