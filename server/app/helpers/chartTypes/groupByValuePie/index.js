import Filters from 'app/collections/Filters'
import groupBuilder from './groupBuilder'
import getTotal from './getTotal'
import queryBuilder from './queryBuilder'

export default {
  name: 'Agrupar por Valor (Torta)',
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
    filterParams: {
      type: String,
      label:
        '(opcional) Parámetros personalizados del item para entregar a el filtro (que está por defecto) de la tabla (formato JSON). Ej: {"nombreDelParámetroDelFiltro": "nombreDelCampoDelItem"}. Por defecto se entregan todos los parametros del item para el uso del filtro',
      fieldType: 'textArea',
      defaultValue: '{}',
      optional: true
    },
    fieldsToGroupBy: {
      type: [String],
      label: 'Campos a usar para agrupar los resultados de cada tabla',
      fieldType: 'collectionFieldSelect',
      fieldOptions: {
        multi: true
      },
      min: 1,
      optional: true
    },
    xAxisTicks: {
      type: String,
      label: 'Campos para agrupar los datos',
      fieldType: 'collectionFieldSelect',
      min: 1,
      optional: true
    },
    accumulatorOperations: {
      type: String,
      label:
        'Tipo de operación. Opciones: $sum, $avg, $first, $last, $max, $min, $push, $addToSet, $stdDevPop, $stdDevSamp. Ingresar los datos en el orden en que se quieran aplicar a cada tabla. Ej: $sum,$avg,$max',
      optional: true
    },
    fieldToOperateOn: {
      type: String,
      label: 'Campo sobre el cual realizar la operación',
      fieldType: 'collectionFieldSelect',
      only: ['currency', 'number', 'percentage']
    },
    colorGradient: {
      type: String,
      label:
        '(opcional) Colores para asignar a las series como gradientes, en formato rgba. Ej: rgb(85, 88, 218)&&rgb(95, 209, 249)',
      defaultValue: 'rgba(85, 88, 218, 1)&&rgba(95, 209, 249, 1)',
      optional: true
    },
    specificColors: {
      type: String,
      label:
        '(opcional) Colores para asignar a cada serie en particular, en formato rgba. Útil si se conoce a priori la cantidad de series resultantes. Ej: rgba(233,53,0,1)&&rgba(0,191,255,1)&&rgba(85,88,218,1)&&rgba(255,185,0,1)&&...',
      optional: true
    },
    startHintText: {
      type: String,
      label: '(opcional) Texto a anteponer al valor en el cuadro de detalle',
      optional: true
    },
    endHintText: {
      type: String,
      label: '(opcional) Texto a anteponer al valor en el cuadro de detalle',
      optional: true
    },
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
    }
  },
  async getResult({
    options: {
      filterParams,
      fieldsToGroupBy,
      accumulatorOperations,
      xAxisTicks,
      queries,
      fieldToOperateOn,
      sort,
      colorGradient,
      specificColors,
      startHintText,
      endHintText
    },
    params,
    query,
    collectionId,
    collection,
    chart
  }) {
    let filterOptions = {...params}
    const filterUserParams = JSON.parse(filterParams)
    for (const key in filterUserParams) {
      const userParam = filterUserParams[key]
      if (Object.keys(params).includes(userParam)) {
        filterOptions[key] = params[userParam]
      } else {
        filterOptions[key] = userParam
      }
    }

    const parsedQueries = await Promise.all(
      queries.map(async (query, index) => {
        const filter = await Filters.findOne(query)

        return await filter.createQuery({filterOptions})
      })
    )
    const group = groupBuilder([xAxisTicks])
    const operators = accumulatorOperations.split(',').map(op => op)
    const total = getTotal(operators, fieldToOperateOn)
    const [results] = await Promise.all(
      parsedQueries.map(async (query, index) => {
        const pipeline = queryBuilder(query, group, total[index], sort)
        const result = await collection.aggregate(pipeline).toArray()
        return result
      })
    )

    const perimeterLength = results.reduce((prev, cur) => {
      const value = operators.includes('$count') ? cur.count : cur.total
      return prev + value
    }, 0)

    let angle0 = 0
    let dataset = results.map(function(res, index) {
      const value = operators.includes('$count') ? res.count : res.total
      const portion = value / perimeterLength
      const angle = angle0 + Math.PI * 2 * portion
      const radius0 = 0
      const radius = 1
      const color = index
      const label = res._id[fieldsToGroupBy[0]]
      const data = {
        angle0,
        angle,
        radius0,
        radius,
        color,
        label,
        value
      }
      angle0 = angle
      return data
    })

    let colorRange = []
    const colorDomain = [0, results.length - 1]
    let legendItems = []
    let colorType = ''

    if (!specificColors) {
      colorType = 'linear'
      colorRange = colorGradient.split('&&')
      const colors = interpolateColors(colorRange[0], colorRange[1], results.length)
      legendItems = dataset.map((set, index) => ({title: set.label, color: colors[index]}))
    } else {
      colorType = 'literal'
      colorRange = specificColors.split('&&')
      legendItems = dataset.map((set, index) => ({title: set.label, color: colorRange[index]}))
      dataset = dataset.map((set, index) => ({...set, color: colorRange[index]}))
    }

    return {
      renderType: 'pieGroupedByValues',
      dataset,
      colorDomain,
      colorRange,
      colorType,
      legend: {
        use: 'discrete',
        discrete: {
          items: legendItems
        },
        // pending implementation
        continuous: {
          startTitle: '01',
          midTitle: '04',
          endTitle: '06',
          startColor: 'rgb(85, 88, 218)',
          midColor: '',
          endColor: 'rgb(95, 209, 249)'
        }
      },
      startHintText,
      endHintText
    }
  }
}

// functions to calculate colors taken from this post: https://graphicdesign.stackexchange.com/questions/100917/how-do-i-calculate-color-gradients
// fiddle url: https://jsfiddle.net/002v98LL/
function interpolateColor(color1, color2, factor) {
  if (arguments.length < 3) {
    factor = 0.5
  }
  let result = color1.slice()
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]))
  }
  return 'rgba(' + result.join(',') + ')'
}

function interpolateColors(color1, color2, steps) {
  const stepFactor = 1 / (steps - 1),
    interpolatedColorArray = []

  color1 = color1.match(/\d+/g).map(Number)
  color2 = color2.match(/\d+/g).map(Number)

  for (let i = 0; i < steps; i++) {
    interpolatedColorArray.push(interpolateColor(color1, color2, stepFactor * i))
  }

  return interpolatedColorArray
}
