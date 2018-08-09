export default {
  name: 'Archivo en una URL',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optionsSchema: null,
  validate(value, options) {
    if (value && !/^https?:.*/.test(value)) {
      return 'invalidLink'
    }
  }
}
