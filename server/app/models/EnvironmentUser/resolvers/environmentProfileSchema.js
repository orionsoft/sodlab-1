import {resolver} from '@orion-js/app'

export default resolver({
  params: {},
  returns: String,
  async resolve(environmentUser, params, viewer) {
    const environment = await environmentUser.environment()
    return await environment.schema()
  }
})
