const Option = {
  label: {
    type: String
  },
  value: {
    type: String
  }
}

export default {
  name: 'Opciones',
  rootType: String,
  allowedOperatorsIds: ['exists', 'stringStartsWith'],
  optionsSchema: {
    options: {
      type: [Option]
    }
  }
}
