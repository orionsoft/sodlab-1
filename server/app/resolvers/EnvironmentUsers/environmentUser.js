import {resolver} from '@orion-js/app'
import EnvironmentUser from 'app/models/EnvironmentUser'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {
    environmentUserId: {
      type: 'ID',
      optional: true
    },
    userId: {
      type: 'ID',
      optional: true
    }
  },
  returns: EnvironmentUser,
  async resolve({environmentUserId, userId}, viewer) {
    if (userId) {
      return await EnvironmentUsers.findOne({userId})
    } else if (environmentUserId) {
      return await EnvironmentUsers.findOne(environmentUserId)
    }
  }
})
