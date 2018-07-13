export default {
  name: 'Fecha con hora',
  rootType: Date,
  allowedOperatorsIds: ['exists', 'equalDateTime', 'dateTimeLessEqualThan'],
  optionsSchema: null,
  validate(value, options) {}
}
