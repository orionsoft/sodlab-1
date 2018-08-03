import checkJSONArray from 'app/helpers/misc/checkJSONArray'

export default {
  name: 'Selección multiple',
  rootType: [String],
  allowedOperatorsIds: [
    'exists',
    'containString',
    'notContainString',
    'equalString',
    'notEqualString',
    'stringStartsWith',
    'notStringStartsWith'
  ],
  optional: false,
  optionsSchema: {
    options: {
      type: ['blackbox'],
      fieldType: 'selectOptions',
      async custom(options) {
        if (checkJSONArray(options, ['value', 'label'])) {
          return 'missing Option'
        }
      }
    }
  }
}
