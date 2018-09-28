import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    params: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(chart, {params}, viewer) {
    const result = {}
    for (const key of Object.keys(chart.options)) {
      const option = chart.options[key]
      if (option.type === 'parameter') {
        result[key] = params[option.parameterName]
      } else if (option.type === 'fixed') {
        result[key] = option.fixed ? option.fixed.value : null
      }
    }
    return result
  }
})
