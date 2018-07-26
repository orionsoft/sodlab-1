import objectSchema from 'app/helpers/misc/objectSchema'

export default {
  name: 'Selección',
  rootType: String,
  allowedOperatorsIds: ['exists', 'idEquals'],
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
