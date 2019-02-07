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
    label: 'Título',
    optional: true
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
  hookResult: {
    type: String,
    label: 'Hook Result',
    optional: true,
    defaultValue: 'params',
    description: 'Solo acepta los valores "params" o digitos enteros',
    async custom(hookResult, {doc}) {
      if (!/^\d+$/.test(hookResult) && hookResult !== 'params') {
        return 'invalid'
      }
    }
  },
  itemNumberResult: {
    type: Number,
    label: 'Número del item del cual entregar los valores al front en una operación de tipo batch',
    optional: true
  },
  shouldStopHooksOnError: {
    type: Boolean,
    label: 'Detener la ejecución de los hooks si ocurre un error',
    defaultValue: false,
    optional: true
  },
  firstHook: {
    type: 'ID',
    label: 'firstHook',
    optional: true,
    defaultValue: ''
  },
  lastHook: {
    type: 'ID',
    label: 'lastHook',
    optional: true,
    defaultValue: ''
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
  },
  postItemToUrl: {
    type: String,
    label: 'Url a la cual enviar los datos',
    optional: true
  },
  helperType: {
    type: String,
    label: 'Tipo de botón a mostrar',
    optional: true
  },
  onSuccessMessage: {
    type: String,
    label: 'Mensaje a mostrar al ejecutar exitosamente el momento',
    optional: true
  },
  onErrorMessage: {
    type: String,
    label: 'Mensaje a mostrar al ejecutar exitosamente el momento',
    optional: true
  }
}
