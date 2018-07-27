import checkJSON from 'app/helpers/misc/checkJSON'

export default {
  name: 'Selección multiple',
  rootType: [String],
  allowedOperatorsIds: ['exists'],
  optional: false,
  optionsSchema: {
    options: {
      type: ['blackbox'],
      fieldType: 'selectOptions',
      async custom(options) {
        if (checkJSON(options, ['value', 'label'])) {
          return 'missing Option'
        }
      }
    }
  }
}
