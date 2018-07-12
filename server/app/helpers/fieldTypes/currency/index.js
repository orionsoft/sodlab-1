export default {
  name: 'Moneda',
  rootType: Number,
  allowedOperatorsIds: ['exists', 'equalNumber', 'numberGreaterThan', 'numberLessThan', 'numberGreaterEqual', 'numberLessEqual'],
  optionsSchema: {},
  validate(value, options) {}
}
