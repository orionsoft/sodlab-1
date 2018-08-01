export default {
  name: 'Caja de Texto',
  rootType: String,
  allowedOperatorsIds: ['exists', 'stringStartsWith', 'equalString', 'containString'],
  optionsSchema: {
    minHeight: {
      label: 'Cantidad mínima de líneas',
      type: Number,
      optional: true
    }
  },
  validate(value, options) {}
}
