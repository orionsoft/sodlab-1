import isNumber from 'lodash/isNumber'

export default {
  name: 'Percentage',
  rootType: Number,
  allowedOperatorsIds: ['exists'],
  optionsSchema: {},
  validate(value, options) {
    if (!isNumber(value)) {
      return 'invalidPercentage'
    }
  }
}
