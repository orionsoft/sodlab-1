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
  optionsSchema: {},
  validate(value, options) {}
}
