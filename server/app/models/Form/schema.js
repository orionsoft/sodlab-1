import Forms from 'app/collections/Forms'
import Field from './Field'
export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber un formulario con este nombre',
    async custom(name, {doc}) {
      if (doc.formId) {
        const form = await Forms.findOne(doc.formId)
        const result = await Forms.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: form.environmentId
        })
        if (result && form._id !== result._id) return 'notUnique'
      }
    }
  },
  title: {
    type: String,
    label: 'Título'
  },
  type: {
    type: String,
    label: 'Tipo',
    optional: true,
    allowedValues: ['create', 'update']
  },
  collectionId: {
    type: 'ID',
    optional: true
  },
  updateVariableName: {
    type: String,
    optional: true
  },
  fields: {
    type: [Field],
    optional: true
  },
  onSuccessViewPath: {
    type: String,
    label: 'viewPath',
    optional: true
  },
  reset: {
    type: Boolean,
    optional: true
  },
  afterHooksIds: {
    type: ['ID'],
    label: 'Hooks',
    optional: true
  },
  submitButtonText: {
    type: String,
    optional: true
  },
  resetButtonText: {
    type: String,
    optional: true
  }
}
