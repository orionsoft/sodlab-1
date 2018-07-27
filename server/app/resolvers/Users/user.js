import {resolver} from '@orion-js/app'
import User from 'app/models/User'
import Users from 'app/collections/Users'

export default resolver({
  params: {
    userId: {
      type: 'ID'
    }
  },
  returns: User,
  async resolve({userId}, viewer) {
    return await Users.findOne(userId)
  }
})
