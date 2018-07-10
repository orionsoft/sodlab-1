export default {
  name: 'Phone',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optionsSchema: {},
  validate(value, options) {
    let number = value.toString()
    const re = /^\d{9}$/
    if (!re.test(number)) {
      return 'invalid number'
    }
  }
}
