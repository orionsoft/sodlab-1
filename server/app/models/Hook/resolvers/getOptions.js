import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(hook, {params}, viewer) {
    const result = {}
    for (const key of Object.keys(hook.options)) {
      const option = hook.options[key]
      if (option.type === 'parameter') {
        result[key] = params[option.parameterName]
      } else if (option.type === 'fixed') {
        result[key] = option.fixed ? option.fixed.value : null
      }
    }
    return result
  }
})
