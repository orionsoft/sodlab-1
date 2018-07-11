export default {
  name: 'Phone',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optionsSchema: {},
  validate(value, options) {
    let number = value.toString()
    const re = /^[(]*[+][0-9]{3}[)]\d{8}$/
    if (!re.test(number)) {
      return 'invalidNumber'
    }
  }
}
