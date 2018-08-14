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
    custom(path) {
      if (!path.startsWith('/')) return 'invalidPath'
    }
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber una vista con este nombre',
    async custom(name, {doc}) {
      const view = await Views.findOne({
        name: {$regex: `^${name}$`, $options: 'i'},
        environmentId: doc.environmentId
      })
      console.log({view})
      if (view) return 'notUnique'
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
  }
}
