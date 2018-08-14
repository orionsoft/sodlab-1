import {resolver} from '@orion-js/app'
import {serializeSchema} from '@orion-js/graphql'

export default resolver({
  returns: 'blackbox',
  async resolve(functionType, params, viewer) {
    return serializeSchema(functionType.optionsSchema)
  }
})
