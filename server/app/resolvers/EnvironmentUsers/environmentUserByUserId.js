import {resolver} from '@orion-js/app'
import EnvironmentUser from 'app/models/EnvironmentUser'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {
    userId: {
      type: 'ID'
    }
  },
  returns: EnvironmentUser,
  async resolve({userId}, viewer) {
    return await EnvironmentUsers.findOne({userId})
  }
})
