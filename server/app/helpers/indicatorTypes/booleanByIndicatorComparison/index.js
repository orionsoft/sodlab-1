import Indicators from 'app/collections/Indicators'
export default {
  name: 'Operación: Comparación',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    indicator1Id: {
      type: String,
      label: 'Indicador 1',
      fieldType: 'indicatorSelect'
    },
    indicator2Id: {
      type: String,
      label: 'Indicador 2',
      fieldType: 'indicatorSelect'
    },
    operation: {
      type: String,
      label: 'Operación',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Valor de 1 es mayor o igual a 2', value: 'biggerOrEqual'},
          {label: 'Valor de 1 es mayor a 2', value: 'biggerThan'},
          {label: 'Valor de 1 es igual a 2', value: 'equal'},
          {label: 'Valor de 1 es distinto a 2', value: 'notEqual'},
          {label: 'Valor de 1 es menor a 2', value: 'smallerThan'},
          {label: 'Valor de 1 es menor o igual a 2', value: 'smallerOrEqual'}
        ]
      }
    }
  },
  getRenderType: () => 'boolean',
  async getResult({options, params}) {
    const indicator1 = await Indicators.findOne(options.indicator1Id)
    const value1 = await indicator1.result({filterOptions: params, params})
    const indicator2 = await Indicators.findOne(options.indicator2Id)
    const value2 = await indicator2.result({filterOptions: params, params})

    if (options.operation === 'biggerOrEqual') {
      return value1 >= value2
    }
    if (options.operation === 'biggerThan') {
      return value1 > value2
    }
    if (options.operation === 'equal') {
      return value1 === value2
    }
    if (options.operation === 'notEqual') {
      return value1 !== value2
    }
    if (options.operation === 'smallerThan') {
      return value1 < value2
    }
    if (options.operation === 'smallerOrEqual') {
      return value1 <= value2
    }

    return false
  }
}
