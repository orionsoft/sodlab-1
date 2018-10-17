import getIntervals from './getIntervals'

export default {
  name: 'Contar por Fecha',
  optionsSchema: {
    renderType: {
      type: String,
      label: 'Tipo de gráfico',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Barra', value: 'barByDate'}, {label: 'Linea', value: 'lineByDate'}]
      }
    },
    dateKey: {
      type: String,
      label: 'Campo a actualizar',
      fieldType: 'collectionFieldSelect'
    },
    divideBy: {
      type: String,
      label: 'Divide por',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Año', value: 'year'},
          {label: 'Mes', value: 'month'},
          {label: 'Día', value: 'day'},
          {label: 'Hora', value: 'hour'}
        ]
      }
    }
  },
  async getResult({options: {dateKey, divideBy, renderType}, params, query, collection, chart}) {
    const key = dateKey === '_id' ? 'createdAt' : `data.${dateKey}`
    const intervals = await getIntervals({collection, query, dateKey: key, divideBy})
    const points = []

    for (const {fromDate, toDate} of intervals) {
      const [result] = await collection
        .aggregate([
          {
            $match: query
          },
          {
            $match: {
              [key]: {$gt: fromDate, $lte: toDate}
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
      points.push({x: fromDate, y: value})
    }

    return {points, divideBy, renderType}
  }
}
