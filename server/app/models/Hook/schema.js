import Hooks from 'app/collections/Hooks'

export default {
  _id: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber un hook con este nombre',
    async custom(name, {doc}) {
      if (doc.hookId) {
        const hook = await Hooks.findOne(doc.hookId)
        const result = await Hooks.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: hook.environmentId
        })
        if (result && hook._id !== result._id) return 'notUnique'
      }
    }
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
  },
  validationsIds: {
    type: ['ID'],
    label: 'Validaciones',
    optional: true
  },
  shouldThrow: {
    label: '(opcional) No ejecutar si el hook anterior falló (default: No)',
    type: Boolean,
    optional: true,
    defaultValue: false
  }
}
