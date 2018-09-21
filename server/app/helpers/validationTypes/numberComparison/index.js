export default {
  name: 'Comparación de números',
  optionsSchema: {
    value: {
      type: String,
      label: 'Valor'
    },
    type: {
      type: String,
      label: 'Tipo de validación',
      fieldType: 'select',
      fixed: true,
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
    },
    message: {
      type: String,
      label: 'Mensaje personalizado a mostrar',
      optional: true
    }
  },
  async execute({options: {value, type, comparingValue, message}}) {
    if (type === 'biggerOrEqual') {
      if (!(value > comparingValue)) {
        throw new Error(message || 'El valor debe ser mayor o igual a ' + comparingValue)
      }
    } else if (type === 'biggerThan') {
      if (!(value >= comparingValue)) {
        throw new Error(message || 'El valor debe ser mayor a ' + comparingValue)
      }
    } else if (type === 'equanThan') {
      if (!(value === comparingValue)) {
        throw new Error(message || 'El valor debe ser igual a ' + comparingValue)
      }
    } else if (type === 'notEqualThan') {
      if (!(value !== comparingValue)) {
        throw new Error(message || 'El valor debe ser distinto a ' + comparingValue)
      }
    } else if (type === 'smallerThan') {
      if (!(value < comparingValue)) {
        throw new Error(message || 'El valor debe ser menor a ' + comparingValue)
      }
    } else if (type === 'smallerOrEqual') {
      if (!(value <= comparingValue)) {
        throw new Error(message || 'El valor debe ser menor o igual a ' + comparingValue)
      }
    }
  }
}
