export default {
  name: 'Hyperlink',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optionsSchema: null,
  validate(value, options) {
    if (!/https?:.*/.test(value)) {
      return 'invalidLink'
    }
  }
}
