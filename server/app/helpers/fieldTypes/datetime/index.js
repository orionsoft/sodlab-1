export default {
  name: 'Fecha con hora',
  rootType: Date,
  allowedOperatorsIds: [
    'exists',
    'equalDateTime',
    'dateTimeGreaterThan',
    'dateTimeGreaterEqualThan',
    'dateTimeLessEqualThan',
    'dateTimeLessThan'
  ],
  optionsSchema: null,
  validate(value, options) {}
}
