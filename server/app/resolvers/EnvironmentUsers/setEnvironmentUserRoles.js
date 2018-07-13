import {resolver} from '@orion-js/app'
import EnvironmentUser from 'app/models/EnvironmentUser'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {
    environmentUserId: {
      type: 'ID'
    },
    roles: {
      type: ['ID']
    }
  },
  returns: EnvironmentUser,
  mutation: true,
  role: 'admin',
  async resolve({environmentUserId, roles}, viewer) {
    const environmentUser = await EnvironmentUsers.findOne(environmentUserId)
    environmentUser.update({$set: {roles}})
    return environmentUser
  }
})
