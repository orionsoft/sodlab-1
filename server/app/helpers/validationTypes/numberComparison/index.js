import numeral from 'numeral'

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
    }
  },
  async execute({options: {value, type, comparingValue}}) {
    const formatedValue = numeral(value).value()
    if (type === 'biggerOrEqual') {
      if (!(formatedValue > comparingValue)) {
        throw new Error('El valor debe ser mayor o igual a ' + comparingValue)
      }
    } else if (type === 'biggerThan') {
      if (!(formatedValue >= comparingValue)) {
        throw new Error('El valor debe ser mayor a ' + comparingValue)
      }
    } else if (type === 'equalThan') {
      if (!(formatedValue === comparingValue)) {
        throw new Error('El valor debe ser igual a ' + comparingValue)
      }
    } else if (type === 'notEqualThan') {
      if (!(formatedValue !== comparingValue)) {
        throw new Error('El valor debe ser distinto a ' + comparingValue)
      }
    } else if (type === 'smallerThan') {
      if (!(formatedValue < comparingValue)) {
        throw new Error('El valor debe ser menor a ' + comparingValue)
      }
    } else if (type === 'smallerOrEqual') {
      if (!(formatedValue <= comparingValue)) {
        throw new Error('El valor debe ser menor o igual a ' + comparingValue)
      }
    }
  }
}
