import {resolver} from '@orion-js/app'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {},
  returns: String,
  async resolve(environmentUser, params, viewer) {
    return await Environments.findOne(environmentUser.environmentId)
  }
})
