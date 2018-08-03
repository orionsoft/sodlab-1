export default {
  name: 'Hipervínculo',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optionsSchema: null,
  validate(value, options) {
    if (value && !/^https?:.*/.test(value)) {
      return 'invalidLink'
    }
  }
}
