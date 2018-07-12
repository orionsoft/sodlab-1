import {resolver} from '@orion-js/app'
import EnvironmentUser from 'app/models/EnvironmentUser'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {
    environmentUserId: {
      type: 'ID'
    }
  },
  returns: EnvironmentUser,
  async resolve({environmentUserId}, viewer) {
    return await EnvironmentUsers.findOne(environmentUserId)
  }
})
