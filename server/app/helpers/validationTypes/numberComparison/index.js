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
        options: [
          {label: 'Mayor o igual que', value: 'biggerOrEqual'},
          {label: 'Mayor que', value: 'biggerThan'},
          {label: 'Igual que', value: 'equalThan'},
          {label: 'Distinto que', value: 'notEqualThan'},
          {label: 'Menor que', value: 'smallerThan'},
          {label: 'Menor o igual que', value: 'smallerOrEqual'}
        ]
      }
    },
    comparingValue: {
      type: Number,
      label: 'Valor de comparación'
    }
  },
  async execute({options: {value, type, comparingValue}}) {
    if (type === 'biggerOrEqual') {
      if (!(value > comparingValue)) {
        throw new Error('El valor debe ser mayor o igual a ' + comparingValue)
      }
    } else if (type === 'biggerThan') {
      if (!(value >= comparingValue)) {
        throw new Error('El valor debe ser mayor a ' + comparingValue)
      }
    } else if (type === 'equanThan') {
      if (!(value === comparingValue)) {
        throw new Error('El valor debe ser igual a ' + comparingValue)
      }
    } else if (type === 'notEqualThan') {
      if (!(value !== comparingValue)) {
        throw new Error('El valor debe ser distinto a ' + comparingValue)
      }
    } else if (type === 'smallerThan') {
      if (!(value < comparingValue)) {
        throw new Error('El valor debe ser menor a ' + comparingValue)
      }
    } else if (type === 'smallerOrEqual') {
      if (!(value <= comparingValue)) {
        throw new Error('El valor debe ser mayor a ' + comparingValue)
      }
    }
  }
}
