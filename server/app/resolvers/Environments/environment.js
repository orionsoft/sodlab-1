import {resolver} from '@orion-js/app'
import Environment from 'app/models/Environment'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    }
  },
  returns: Environment,
  async resolve({environmentId}, viewer) {
    return await Environments.findOne(environmentId)
  }
})
