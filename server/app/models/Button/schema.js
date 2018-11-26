import Buttons from 'app/collections/Buttons'
import Parameter from './Parameter'

export default {
  _id: {
    type: 'ID'
  },
  name: {
    type: String,
    label: 'Nombre',
    description: 'Solo puede haber un button con este nombre',
    async custom(name, {doc}) {
      if (doc.buttonId) {
        const button = await Buttons.findOne(doc.buttonId)
        const result = await Buttons.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: button.environmentId
        })
        if (result && button._id !== result._id) return 'notUnique'
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
  createdAt: {
    type: Date
  },
  afterHooksIds: {
    type: ['ID'],
    label: 'Hooks',
    optional: true,
    defaultValue: []
  },
  buttonType: {
    type: String,
    optional: true
  },
  icon: {
    type: String,
    optional: true
  },
  buttonText: {
    type: String,
    optional: true
  },
  url: {
    type: String,
    optional: true
  },
  parameters: {
    type: [Parameter],
    optional: true
  },
  orderFiltersByName: {
    type: Boolean,
    optional: true
  },
  requireTwoFactor: {
    type: Boolean,
    optional: true
  },
  goBack: {
    type: Boolean,
    optional: true
  },
  hsmHookId: {
    type: 'ID',
    label: 'HSM Hook',
    optional: true
  }
}
