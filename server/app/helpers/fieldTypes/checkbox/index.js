export default {
  name: 'Checkbox',
  dbType: Boolean,
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
