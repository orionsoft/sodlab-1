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
  async resolve(indicator, {params}, viewer) {
    if (!indicator.options) return {}
    const result = {}
    for (const key of Object.keys(indicator.options)) {
      const option = indicator.options[key]
      if (option.type === 'parameter') {
        result[key] = params[option.parameterName]
      } else if (option.type === 'fixed') {
        result[key] = option.fixed.value
      }
    }
    return result
  }
})
