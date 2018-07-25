import {resolver} from '@orion-js/app'
import Users from 'app/collections/Users'
import User from 'app/models/User'

export default resolver({
  params: {
    userId: {
      type: 'ID'
    },
    environmentsAuthorized: {
      type: ['ID']
    }
  },
  returns: User,
  requireUserId: true,
  mutation: true,
  role: 'superAdmin',
  async resolve({userId, environmentsAuthorized}, viewer) {
    await Users.update(userId, {$set: {environmentsAuthorized}})
    return await Users.findOne(userId)
  }
})
