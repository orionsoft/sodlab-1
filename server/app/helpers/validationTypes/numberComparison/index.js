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
    numberValue: {
      type: Number,
      label: 'Valor de comparación'
    },
    message: {
      type: String,
      label: 'Mensaje personalizado a mostrar',
      optional: true
    }
  },
  async execute({options: {value, type, numberValue, message}}) {
    const formatedValue = numeral(value).value()
    if (type === 'biggerOrEqual') {
      if (!(formatedValue > numberValue)) {
        throw new Error(message || 'El valor debe ser mayor o igual a ' + numberValue)
      }
    } else if (type === 'biggerThan') {
      if (!(formatedValue >= numberValue)) {
        throw new Error(message || 'El valor debe ser mayor a ' + numberValue)
      }
    } else if (type === 'equanThan') {
      if (!(formatedValue === numberValue)) {
        throw new Error(message || 'El valor debe ser igual a ' + numberValue)
      }
    } else if (type === 'notEqualThan') {
      if (!(formatedValue !== numberValue)) {
        throw new Error(message || 'El valor debe ser distinto a ' + numberValue)
      }
    } else if (type === 'smallerThan') {
      if (!(formatedValue < numberValue)) {
        throw new Error(message || 'El valor debe ser menor a ' + numberValue)
      }
    } else if (type === 'smallerOrEqual') {
      if (!(formatedValue <= numberValue)) {
        throw new Error(message || 'El valor debe ser menor o igual a ' + numberValue)
      }
    }
  }
}
