import Filters from 'app/collections/Filters'
import Environments from 'app/collections/Environments'
import groupBuilder from './groupBuilder'
import getTotal from './getTotal'
import queryBuilder from './queryBuilder'
import getXAxisLabels from './getXAxisLabels'
import sortByXAxisValues from './sortByXAxisValues'
import formatXAxisDateValues from './formatXAxisDateValues'

export default {
  name: 'Agrupar por Valor (Barra)',
  optionsSchema: {
    queries: {
      type: [String],
      label:
        'Filtros a usar para buscar los datos. (Siempre se tendrá como mínimo la extracción completa de datos)',
      fieldType: 'filterSelect',
      fieldOptions: {
        multi: true
      },
      optional: true
    },
    chartTypes: {
      type: String,
      label:
        '(opcional) Tipo de gráfico. Por defecto se usará de barras. Opciones: $bar, $line, $dot, $curvedLine. Ingresar los gráficos en el orden en que se quieran aplicar a cada filtro. Ej: $bar,$dot,$line',
      optional: true
    },
    xAxisTicks: {
      type: String,
      label: 'Valores para el eje X (Los datos se agruparan segun este valor)',
      fieldType: 'collectionFieldSelect'
    },
    legend: {
      type: String,
      label:
        '(opcional) Títulos (leyenda) para cada serie de datos. Por defecto se usará el título del filtro. El orden en que se asignan debe ser igual al orden de los filtros. Usar "&&" para separar los titulos y -- para omitir un título y usar el del filtro',
      optional: true
    },
    // fieldsToGroupBy: {
    //   type: [String],
    //   label: 'Campos a usar para agrupar el resultado',
    //   fieldType: 'collectionFieldSelect',
    //   fieldOptions: {
    //     multi: true
    //   },
    //   min: 1
    // },
    accumulatorOperations: {
      type: String,
      label:
        'Tipo de operación. Opciones: $sum, $avg, $first, $last, $max, $min, $push, $addToSet, $stdDevPop, $stdDevSamp. Ingresar los datos en el orden en que se quieran aplicar a cada filtro. Ej: $sum,$avg,$max'
    },
    fieldToOperateOn: {
      type: String,
      label: 'Campo sobre el cual realizar la operación',
      fieldType: 'collectionFieldSelect',
      only: ['currency', 'number', 'percentage']
    },
    yAxisTitle: {
      type: String,
      label: '(opcional) Título del eje Y',
      defaultValue: '',
      optional: true
    },
    yLabelAngle: {
      type: Number,
      label: '(opcional) Angulo de inclinación de los rotuladores del eje Y (valor de 0 a 360)',
      defaultValue: 0,
      optional: true
    },
    xAxisTitle: {
      type: String,
      label: '(opcional) Título del eje X',
      defaultValue: '',
      optional: true
    },
    xLabelAngle: {
      type: Number,
      label: '(opcional) Angulo de inclinación de los rotuladores del eje X (valor de 0 a 360)',
      defaultValue: 0,
      optional: true
    },
    hintValueText: {
      type: String,
      label: '(opcional) Texto para el valor en el cuadro de detalle',
      optional: true
    },
    xyPlotMargin: {
      type: String,
      label:
        '(opcional) Margenes del gráfico. Tiene el siguiente formato y valor por defecto: {"left": 40, "right": 10, "top": 10, "bottom": 40}',
      defaultValue: '{"left": 40, "right": 10, "top": 10, "bottom": 40}',
      optional: true
    },
    // divideBy: {
    //   type: Number,
    //   label: 'Divide por',
    //   fieldType: 'select',
    //   fieldOptions: {
    //     options: [
    //       {label: '1.000.000', value: 1000000},
    //       {label: '1.000', value: 1000},
    //       {label: '100', value: 100},
    //       {label: '10', value: 10},
    //       {label: '1', value: 1}
    //     ]
    //   }
    // },
    sort: {
      type: Number,
      label: '(opcional) Ordenar valores del eje Y de forma ascendente o descendente',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Ascendente', value: 1},
          {label: 'Sin Orden', value: 0},
          {label: 'Descendente', value: -1}
        ]
      },
      optional: true,
      defaultValue: 0
    },
    sortXAxisValues: {
      type: String,
      label: '(opcional) Ordenar valores del eje X de forma ascendente o descendente',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Texto - Ascendente', value: 'textAsc'},
          {label: 'Texto - Descendente', value: 'textDesc'},
          {label: 'Númerico - Ascendente', value: 'numAsc'},
          {label: 'Númerico - Descendente', value: 'numDesc'}
        ]
      },
      optional: true,
      defaultValue: null
    },
    dateFormatXAxisValues: {
      type: String,
      label:
        '(opcional) Dar formato de fecha a los valores del eje X. Ver todas las opciones disponibles en https://momentjs.com/docs/#/displaying/format/',
      optional: true
    }
  },
  async getResult({
    options: {
      xAxisTitle,
      xLabelAngle,
      xAxisTicks,
      yAxisTitle,
      yLabelAngle,
      queries,
      chartTypes,
      legend,
      fieldToOperateOn,
      accumulatorOperations,
      divideBy,
      sort,
      sortXAxisValues,
      hintValueText,
      xyPlotMargin,
      dateFormatXAxisValues
    },
    params,
    query,
    collectionId,
    collection,
    chart
  }) {
    const environment = await Environments.findOne(chart.environmentId)
    const xAxisLabels = await getXAxisLabels(collectionId, xAxisTicks)
    const group = groupBuilder([xAxisTicks])
    const operators = accumulatorOperations.split(',').map(op => op)
    const total = getTotal(operators, fieldToOperateOn)
    const customTitles = legend ? legend.split('&&').map(title => title) : null
    let titles = []

    const getQueries = queries.map(async (query, index) => {
      const filter = await Filters.findOne(query)

      if (customTitles !== null) {
        if (customTitles[index] && customTitles[index] !== '--') {
          titles[index] = {title: customTitles[index]}
        } else {
          titles[index] = {title: filter.title}
        }
      } else {
        titles[index] = {title: filter.title}
      }

      return await filter.createQuery({filterOptions: {...params}})
    })

    const parsedQueries = await Promise.all(getQueries)
    let datasets = {}
    const allQueries = [...parsedQueries]
    const resultsPromise = allQueries.map(async (query, index) => {
      const pipeline = queryBuilder(query, group, total[index], sort)
      const result = await collection.aggregate(pipeline).toArray()
      return result
    })
    const results = await Promise.all(resultsPromise)

    results.map((result, index) => {
      const currentDataset = `dataset_${index}`
      datasets[currentDataset] = []

      result.map((res, index) => {
        xAxisLabels.map(field => {
          const x = res._id[xAxisTicks] || field
          const y = Math.round(res.total) || 0
          datasets[currentDataset][index] = {x, y}
        })
      })
    })
    datasets = sortByXAxisValues(datasets, sortXAxisValues)
    datasets = formatXAxisDateValues(datasets, dateFormatXAxisValues, environment.timezone)
    const charts = chartTypes ? chartTypes.split(',') : []
    const margins = JSON.parse(xyPlotMargin)

    return {
      charts,
      datasets,
      divideBy,
      renderType: 'barGroupedByValues',
      xAxisTitle,
      yAxisTitle,
      xLabelAngle,
      yLabelAngle,
      titles,
      hintValueText,
      margins
    }
  }
}
