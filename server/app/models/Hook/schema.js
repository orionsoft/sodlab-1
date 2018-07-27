export default {
  _id: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre'
  },
  environmentId: {
    type: 'ID'
  },
  createdAt: {
    type: Date
  },
  functionTypeId: {
    type: 'ID',
    optional: true
  },
  options: {
    type: 'blackbox',
    optional: true
  }
}
