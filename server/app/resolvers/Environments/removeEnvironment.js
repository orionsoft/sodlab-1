import Environments from 'app/collections/Environments'
import {resolver} from '@orion-js/app'
import postRemoveEnvironment from 'app/helpers/resolvers/environments/postRemoveEnvironment'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({environmentId}, viewer) {
    await postRemoveEnvironment(environmentId)
    await Environments.remove(environmentId)
    return true
  }
})
