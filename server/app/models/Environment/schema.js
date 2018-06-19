import {File} from '@orion-js/file-manager'

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
    optional: true,
    custom(url) {
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
  }
}
