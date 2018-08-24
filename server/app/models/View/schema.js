import ViewItem from './ViewItem'
import Views from 'app/collections/Views'

export default {
  _id: {
    type: 'ID'
  },
  environmentId: {
    type: 'ID'
  },
  path: {
    type: String,
    label: 'Ruta',
    async custom(path, {doc}) {
      if (!path.startsWith('/')) return 'invalidPath'
      if (doc.viewId) {
        const view = await Views.findOne(doc.viewId)
        const result = await Views.findOne({path, environmentId: view.environmentId})
        if (result && view._id !== result._id) return 'notUnique'
      }
    }
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber una vista con este nombre',
    async custom(name, {doc}) {
      if (doc.viewId) {
        const view = await Views.findOne(doc.viewId)
        const result = await Views.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: view.environmentId
        })
        if (result && view._id !== result._id) return 'notUnique'
      }
    }
  },
  title: {
    type: String,
    label: 'Título',
    optional: true
  },
  createdAt: {
    type: Date
  },
  items: {
    label: 'Items',
    type: [ViewItem],
    optional: true
  },
  roles: {
    type: ['ID'],
    defaultValue: []
  },
  intercom: {
    type: Boolean,
    optional: true
  }
}
