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
  type: {
    type: String,
    label: 'Tipo',
    allowedValues: ['create', 'update']
  },
  collectionId: {
    type: 'ID'
  }
}
