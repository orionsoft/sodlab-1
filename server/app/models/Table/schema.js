export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  title: {
    type: String,
    label: 'Título'
  },
  name: {
    type: String,
    label: 'Nombre'
  },
  createdAt: {
    type: Date
  },
  collectionId: {
    type: 'ID',
    optional: true
  }
}
