export default {
  name: 'Porcentaje limitado',
  rootType: Number,
  allowedOperatorsIds: [
    'exists',
    'equalNumber',
    'numberGreaterThan',
    'numberLessThan',
    'numberGreaterEqual',
    'numberLessEqual'
  ],
  optionsSchema: {},
  validate(value, options) {}
}
