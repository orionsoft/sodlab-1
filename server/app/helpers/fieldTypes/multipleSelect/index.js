import objectSchema from 'app/helpers/misc/objectSchema'

export default {
  name: 'Selección multiple',
  rootType: String,
  allowedOperatorsIds: ['exists'],
  optional: false,
  optionsSchema: {
    options: {
      type: ['blackbox'],
      fieldType: 'selectOptions',
      async custom(options) {
        if (objectSchema(options, ['value', 'label'])) {
          return 'missing Option'
        }
      }
    }
  }
}
