export default {
  name: 'Moneda',
  rootType: Number,
  allowedOperatorsIds: ['exists', 'equalNumber', 'numberGreaterThan', 'numberLessThan', 'numberGreaterEqual'],
  optionsSchema: {},
  validate(value, options) {}
}
