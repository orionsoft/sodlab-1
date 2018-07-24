import {resolver} from '@orion-js/app'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import EnvironmentUser from 'app/models/EnvironmentUser'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    }
  },
  returns: EnvironmentUser,
  async resolve({environmentId}, viewer) {
    return await EnvironmentUsers.findOne({environmentId, userId: viewer.userId})
  }
})
