import {resolver} from '@orion-js/app'
import Users from 'app/collections/Users'

export default resolver({
  params: {},
  returns: String,
  async resolve({userId}, params, viewer) {
    const user = await Users.findOne(userId)
    return user.emails[0].address
  }
})
