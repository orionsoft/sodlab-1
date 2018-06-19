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
  createdAt: {
    type: Date
  },
  collectionId: {
    type: 'ID',
    optional: true
  }
}
