import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(validation, {params}, viewer) {
    const result = {}
    for (const key of Object.keys(validation.options)) {
      const option = validation.options[key]
      if (option.type === 'parameter') {
        result[key] = params[option.parameterName]
      } else if (option.type === 'fixed') {
        result[key] = option.fixed.value
      }
    }
    return result
  }
})
