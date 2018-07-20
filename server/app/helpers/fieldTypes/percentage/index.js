export default {
  name: 'Porcentaje',
  rootType: Number,
  allowedOperatorsIds: [
    'exists',
    'equalNumber',
    'numberGreaterThan',
    'numberLessThan',
    'numberGreaterEqual',
    'numberLessEqual'
  ],
  optionsSchema: {
    min: {
      label: 'Porcentaje mínimo',
      type: Number
    },
    max: {
      label: 'Porcentaje máximo',
      type: Number
    }
  },
  validate(value, options) {}
}
