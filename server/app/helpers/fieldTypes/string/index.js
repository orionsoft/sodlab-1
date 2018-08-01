export default {
  name: 'Texto',
  rootType: String,
  allowedOperatorsIds: [
    'exists',
    'stringStartsWith',
    'notStringStartsWith',
    'equalString',
    'notEqualString',
    'containString',
    'notContainString'
  ],
  optionsSchema: null,
  validate(value, options) {}
}
