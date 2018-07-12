export default {
  name: 'Número',
  rootType: Number,
  allowedOperatorsIds: ['exists', 'equalNumber', 'numberGreaterThan', 'numberLessThan', 'numberGreaterEqual'],
  optionsSchema: null,
  validate(value, options) {}
}
