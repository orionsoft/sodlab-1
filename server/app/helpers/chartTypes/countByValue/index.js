import getIntervals from './getIntervals'

export default {
  name: 'Contar por Valor',
  optionsSchema: {
    renderType: {
      type: String,
      label: 'Tipo de gráfico',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Barra', value: 'barByValue'}, {label: 'Linea', value: 'lineByValue'}]
      }
    },
    numberKey: {
      type: String,
      label: 'Campo a actualizar',
      fieldType: 'collectionFieldSelect',
      only: ['currency', 'number', 'percentage']
    },
    divideBy: {
      type: Number,
      label: 'Divide por',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: '1.000.000', value: 1000000},
          {label: '1.000', value: 1000},
          {label: '100', value: 100},
          {label: '10', value: 10}
        ]
      }
    }
  },
  async getResult({options: {numberKey, divideBy, renderType}, params, query, collection, chart}) {
    const intervals = await getIntervals({collection, query, numberKey, divideBy})
    const points = []

    for (const {fromValue, toValue} of intervals) {
      console.log({fromValue, toValue})
      const [result] = await collection
        .aggregate([
          {
            $match: query
          },
          {
            $match: {
              [`data.${numberKey}`]: {$gt: fromValue, $lte: toValue}
            }
          },
          {
            $group: {
              _id: null,
              total: {$sum: 1}
            }
          }
        ])
        .toArray()

      const value = result ? result.total : 0
      points.push({x: fromValue, y: value})
    }

    return {points, divideBy, renderType}
  }
}
