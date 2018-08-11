import {resolver} from '@orion-js/app'
import EnvironmentUser from 'app/models/EnvironmentUser'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {
    userId: {
      type: 'ID'
    },
    environmentId: {
      type: 'ID'
    }
  },
  returns: EnvironmentUser,
  async resolve({userId, environmentId}, viewer) {
    return await EnvironmentUsers.findOne({userId, environmentId})
  }
})
