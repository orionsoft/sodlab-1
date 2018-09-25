import getIntervals from './getIntervals'

export default {
  name: 'Barra: Contar por Fecha',
  chartType: 'bar',
  optionsSchema: {
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
  async getResult({options: {dateKey, divideBy}, params, query, collection, chart}) {
    const intervals = await getIntervals({collection, query, dateKey, divideBy})
    const points = []

    for (const {fromDate, toDate} of intervals) {
      const [result] = await collection
        .aggregate([
          {
            $match: query
          },
          {
            $match: {
              [`data.${dateKey}`]: {$gt: fromDate, $lte: toDate}
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
      points.push({date: toDate, value})
    }

    return points
  }
}
