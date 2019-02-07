import {resolver} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import Environment from 'app/models/Environment'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    },
    environment: {
      type: 'blackbox'
    }
  },
  returns: Environment,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, environment}, viewer) {
    const {timezone} = environment
    const item = await Environments.findOne(environmentId)
    await item.update({$set: {timezone}})
    return item
  }
})
