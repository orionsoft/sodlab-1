import Condition from './Condition'
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
  collectionId: {
    type: String,
    label: 'Collección'
  },
  createdAt: {
    type: Date
  },
  conditions: {
    type: [Condition],
    defaultValue: []
  }
}
