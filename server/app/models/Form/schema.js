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
    label: 'Nombre'
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
  fullSize: {
    type: Boolean,
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
  }
}
