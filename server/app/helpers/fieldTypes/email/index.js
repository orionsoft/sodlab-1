export default {
  name: 'Email',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optionsSchema: {},
  validate(value, options) {
    if (!value) return
    if (!/\S+@\S+\.\S+/.test(value)) {
      return 'invalidEmail'
    }
  }
}
