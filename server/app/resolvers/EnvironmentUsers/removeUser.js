import Users from 'app/collections/Users'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    userId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({userId}, viewer) {
    await Users.remove(userId)
    await EnvironmentUsers.remove({userId: userId})
    return true
  }
})
