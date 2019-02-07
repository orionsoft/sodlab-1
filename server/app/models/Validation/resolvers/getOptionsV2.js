import {resolver} from '@orion-js/app'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

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
        if (option.parameterName.includes('user_') && viewer) {
          const user = await EnvironmentUsers.findOne({userId: viewer.userId})
          const param = option.parameterName.replace('user_', '')
          result[key] = user.profile[param]
        } else {
          result[key] = params[option.parameterName]
        }
      } else if (option.type === 'fixed') {
        result[key] = option.fixed.value
      } else if (option.type === 'indicator') {
        result[key] = option.indicatorId
      }
    }
    return result
  }
})
