export default {
  name: 'Checkbox',
  rootType: Boolean,
  allowedOperatorsIds: ['exists', 'booleanIs'],
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
