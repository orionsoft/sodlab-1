export default {
  name: 'Número',
  rootType: Number,
  allowedOperatorsIds: [
    'exists',
    'equalNumber',
    'numberGreaterThan',
    'numberLessThan',
    'numberGreaterEqual',
    'numberLessEqual'
  ],
  optionsSchema: null,
  validate(value, options) {}
}
