export default {
  name: 'Muchos de',
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
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    valueKey: {
      type: String,
      label: 'Campo de valor',
      fieldType: 'collectionFieldSelect'
    },
    labelKey: {
      type: String,
      label: 'Campo de título',
      fieldType: 'collectionFieldSelect'
    },
    filterId: {
      type: String,
      label: 'Filtro',
      fieldType: 'filterSelect',
      optional: true
    }
  }
}
