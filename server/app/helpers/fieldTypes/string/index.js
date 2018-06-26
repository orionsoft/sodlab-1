export default {
  name: 'Texto',
  dbType: String,
  optionsSchema: {
    min: {
      label: 'Largo mínimo',
      type: Number,
      optional: true
    },
    max: {
      label: 'Largo máximo',
      type: Number,
      optional: true
    }
  }
}
