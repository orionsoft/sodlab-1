export default {
  name: 'Fecha',
  rootType: Date,
  allowedOperatorsIds: ['exists', 'dateEqual', 'dateGreaterEqualThan', 'dateLessEqualThan', 'dateGreaterThan'],
  optionsSchema: null,
  validate(value, options) {}
}
