import Condition from './Condition'
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
