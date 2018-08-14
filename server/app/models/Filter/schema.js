import Filters from 'app/collections/Filters'
import Condition from './Condition'
export default {
  _id: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber un filtro con este nombre',
    async custom(name, {doc}) {
      if (doc.filterId) {
        const filter = await Filters.findOne(doc.filterId)
        const result = await Filters.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: filter.environmentId
        })
        if (result && filter._id !== result._id) return 'notUnique'
      }
    }
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
