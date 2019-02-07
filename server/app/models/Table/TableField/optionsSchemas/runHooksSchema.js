export default {
  icon: {
    type: String,
    label: 'icon'
  },
  modalText: {
    type: String,
    label: 'modalText',
    optional: true
  },
  tooltip: {
    type: String,
    label: 'tooltip',
    min: 1
  },
  hooksIds: {
    type: [String],
    label: 'Hooks',
    optional: true
  },
  shouldStopHooksOnError: {
    type: Boolean,
    label: 'Detener la ejecución de los hooks si ocurre un error',
    optional: true,
    defaultValue: false
  },
  requireTwoFactor: {
    type: Boolean,
    label: 'Requiere dos factores',
    optional: true
  }
}
