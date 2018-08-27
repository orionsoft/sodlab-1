import Indicators from 'app/collections/Indicators'
export default {
  name: 'Resta de indicadores',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    indicator1Id: {
      type: String,
      label: 'El valor del indicador',
      fieldType: 'indicatorSelect'
    },
    indicator2Id: {
      type: String,
      label: 'Menos el indicador',
      fieldType: 'indicatorSelect'
    }
  },
  getRenderType: async ({options, params}) => {
    const indicator1 = await Indicators.findOne(
      options.indicator1Id.type === 'fixed' && options.indicator1Id.fixed.value
    )
    if (await indicator1) {
      return await indicator1.renderType({}, null)
    } else {
      const indicator2 = await Indicators.findOne(
        options.indicator2Id.type === 'fixed' && options.indicator2Id.fixed.value
      )
      if (await indicator2) {
        return await indicator2.renderType({}, null)
      }
    }
    return 'number'
  },
  async getResult({options, params}) {
    const indicator1 = await Indicators.findOne(options.indicator1Id)
    const value1 = await indicator1.result({filterOptions: params, params})
    const indicator2 = await Indicators.findOne(options.indicator2Id)
    const value2 = await indicator2.result({filterOptions: params, params})
    return value1 - value2
  }
}
