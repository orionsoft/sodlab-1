export default {
  name: 'Comparación de números',
  optionsSchema: {
    value: {
      type: String,
      label: 'Valor (usar parametro)'
    },
    type: {
      type: String,
      label: 'Tipo de validación',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Mayor que', value: 'biggerThan'}]
      }
    },
    comparingValue: {
      type: Number,
      label: 'Valor de comparación'
    }
  },
  async execute({options: {value, type, comparingValue}}) {
    if (type === 'biggerThan') {
      if (!(value > comparingValue)) {
        throw new Error('El valor debe ser mayor a ' + comparingValue)
      }
    }
  }
}
