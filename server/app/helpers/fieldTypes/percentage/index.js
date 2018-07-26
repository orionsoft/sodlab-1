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
      type: Number,
      optional: true
    },
    max: {
      label: 'Porcentaje máximo',
      type: Number,
      optional: true
    }
  },
  validate(value, options) {}
}
