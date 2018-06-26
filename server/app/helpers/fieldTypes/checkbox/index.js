export default {
  name: 'Checkbox',
  rootType: Boolean,
  optionsSchema: {
    trueLabel: {
      label: 'Texto en positivo',
      type: String
    },
    falseLabel: {
      label: 'Texto en falso',
      type: String
    }
  }
}
