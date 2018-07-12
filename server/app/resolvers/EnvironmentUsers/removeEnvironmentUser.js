import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    environmentUserId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({environmentUserId}, viewer) {
    await EnvironmentUsers.remove(environmentUserId)
    return true
  }
})
