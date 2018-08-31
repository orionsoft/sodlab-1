import {File} from '@orion-js/file-manager'
import Field from 'app/models/Field'
import Environments from 'app/collections/Environments'

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
    label: 'Nombre',
    description: 'Solo puede haber un ambiente con este nombre',
    async custom(name, {doc}) {
      if (doc.environmentId) {
        const environment = await Environments.findOne(doc.environmentId)
        const result = await Environments.findOne({name: {$regex: `^${name}$`, $options: 'i'}})
        if (result && environment._id !== result._id) return 'notUnique'
      }
    }
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
    label: 'Lioren ID Boletas',
    optional: true
  },
  liorenIdBill: {
    type: String,
    label: 'Lioren ID Facturas',
    optional: true
  },
  liorenIdCreditNote: {
    type: String,
    label: 'Lioren ID Nota de Créditos',
    optional: true
  },
  liorenIdDelivery: {
    type: String,
    label: 'Lioren Guía de Despachos',
    optional: true
  },
  intercomId: {
    type: String,
    label: 'Intercom ID',
    optional: true
  },
  exempt: {
    type: Boolean,
    label: 'Facturas, Guía de Despachos y Nota de Créditos',
    fieldType: 'checkbox',
    fieldOptions: {label: 'Activar exento en documentos'},
    defaultValue: false
  },
  exemptTicket: {
    type: Boolean,
    label: 'Boletas',
    fieldType: 'checkbox',
    fieldOptions: {label: 'Activar exento en boletas'},
    defaultValue: false
  }
}
