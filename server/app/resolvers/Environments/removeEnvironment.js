import Environments from 'app/collections/Environments'
import {resolver} from '@orion-js/app'

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
    await Environments.remove(environmentId)
    return true
  }
})
