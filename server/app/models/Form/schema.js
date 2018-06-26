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
  }
}
