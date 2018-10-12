export default {
  name: 'Fecha',
  rootType: Date,
  allowedOperatorsIds: [
    'exists',
    'dateEqual',
    'dateGreaterEqualThan',
    'dateLessEqualThan',
    'dateGreaterThan',
    'dateLessThan',
    'dateNow',
    'dateMonth',
    'dateWeek',
    'dateYear'
  ],
  optionsSchema: null,
  validate(value, options) {}
}
