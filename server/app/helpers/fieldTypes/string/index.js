export default {
  name: 'Texto',
  rootType: String,
  allowedOperatorsIds: ['exists', 'stringStartsWith'],
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
  },
  validate(value, options) {
    if (isFinite(options.min)) {
      if (value.length < options.min) {
        return 'stringTooShort'
      }
    }

    if (isFinite(options.max)) {
      if (value.length > options.max) {
        return 'stringTooLong'
      }
    }
  }
}
