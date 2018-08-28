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
  requireTwoFactor: {
    type: Boolean,
    label: 'Requiere dos factores',
    optional: true
  }
}
