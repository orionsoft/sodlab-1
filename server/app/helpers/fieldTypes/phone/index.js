export default {
  name: 'Teléfono',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optionsSchema: {},
  validate(value, options) {
    if (!value) return
    let number = value.toString()
    const re = /^\d{9}$/
    if (!re.test(number)) {
      return 'invalidNumber'
    }
  }
}
