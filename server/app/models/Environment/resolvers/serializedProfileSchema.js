import {resolver} from '@orion-js/app'
import {serializeSchema} from '@orion-js/graphql'

export default resolver({
  returns: 'blackbox',
  async resolve(environment, params, viewer) {
    return serializeSchema(await environment.profileSchema())
  }
})
