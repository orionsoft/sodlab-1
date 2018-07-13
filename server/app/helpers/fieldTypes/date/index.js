export default {
  name: 'Fecha',
  rootType: Date,
  allowedOperatorsIds: ['exists', 'dateEqual', 'dateGreaterEqualThan', 'dateLessEqualThan', 'dateGreaterThan', 'dateLessThan'],
  optionsSchema: null,
  validate(value, options) {}
}
