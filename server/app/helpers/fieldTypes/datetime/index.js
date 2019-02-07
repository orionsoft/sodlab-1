export default {
  name: 'Fecha con hora',
  rootType: Date,
  allowedOperatorsIds: [
    'exists',
    'equalDateTime',
    'dateTimeGreaterThan',
    'dateTimeGreaterEqualThan',
    'dateTimeLessEqualThan',
    'dateTimeLessThan',
    'dateNow',
    'substractUntilNow',
    'substractUntilNowHours',
    'backwardsDays',
    'backwardsHours',
    'dateEqual',
    'dateGreaterEqualThan',
    'dateLessEqualThan',
    'dateGreaterThan',
    'dateLessThan',
    'dateMonth',
    'dateWeek',
    'dateYear'
  ],
  optionsSchema: null,
  validate(value, options) {}
}
