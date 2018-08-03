import Indicators from 'app/collections/Indicators'
import * as math from 'mathjs'

export default {
  name: 'Operación matemática',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    indicatorsIds: {
      type: [String],
      label: 'Indicadores a usar',
      fieldType: 'indicatorSelect',
      fieldOptions: {multi: true}
    },
    operation: {
      type: String,
      label: 'Operación'
    }
  },
  getRenderType: () => 'number',
  async getResult({options, params}) {
    const values = []
    if (options.indicatorsIds) {
      for (const indicatorId of options.indicatorsIds) {
        const indicator = await Indicators.findOne(indicatorId)
        const value = await indicator.result({filterOptions: params, params})
        values.push(value)
      }
    }

    const a = 97
    const scope = {}
    for (var i = 0; i < values.length; i++) scope[String.fromCharCode(a + i)] = values[i]

    return math.eval(options.operation, scope)
  }
}
