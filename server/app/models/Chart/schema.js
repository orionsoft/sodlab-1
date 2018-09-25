export default {
  _id: {
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
  environmentId: {
    type: 'ID'
  },
  createdAt: {
    type: Date
  },
  chartTypeId: {
    type: 'ID',
    optional: true
  },
  options: {
    type: 'blackbox',
    optional: true
  }
}
