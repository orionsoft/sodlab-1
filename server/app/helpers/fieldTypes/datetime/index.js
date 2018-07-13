export default {
  name: 'Fecha con hora',
  rootType: Date,
  allowedOperatorsIds: ['exists', 'equalDateTime', 'dateTimeGreaterThan', 'dateTimeGreaterEqualThan'],
  optionsSchema: null,
  validate(value, options) {}
}
