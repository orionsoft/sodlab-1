export default {
  name: 'Número',
  rootType: Number,
  allowedOperatorsIds: [
    'exists',
    'equalNumber',
    'substractUntilNow',
    'substractUntilNowHours',
    'numberGreaterThan',
    'numberLessThan',
    'numberGreaterEqual',
    'numberLessEqual'
  ],
  optionsSchema: null,
  validate(value, options) {}
}
