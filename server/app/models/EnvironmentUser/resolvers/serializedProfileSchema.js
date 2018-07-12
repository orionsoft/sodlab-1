import {resolver} from '@orion-js/app'
import {serializeSchema} from '@orion-js/graphql'

export default resolver({
  returns: 'blackbox',
  async resolve(environmentUser, params, viewer) {
    return serializeSchema(await environmentUser.environmentProfileSchema())
  }
})
