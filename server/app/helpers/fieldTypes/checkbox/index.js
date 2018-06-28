export default {
  name: 'Checkbox',
  rootType: Boolean,
  allowedOperatorsIds: ['exists', 'booleanIs'],
  optional: false,
  defaultValue: false,
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
