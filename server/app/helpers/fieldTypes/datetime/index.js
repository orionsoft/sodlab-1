export default {
  name: 'Fecha con hora',
  rootType: Date,
  allowedOperatorsIds: ['exists', 'equalDateTime', 'dateTimeGreaterThan', 'dateTimeGreaterEqualThan', 'dateTimeLessEqualThan'],
  optionsSchema: null,
  validate(value, options) {}
}
