import {resolver} from '@orion-js/app'
import EnvironmentUser from 'app/models/EnvironmentUser'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {
    environmentUserId: {
      type: 'ID'
    },
    profile: {
      type: 'blackbox',
      label: 'Data'
    }
  },
  returns: EnvironmentUser,
  mutation: true,
  role: 'admin',
  async resolve({environmentUserId, profile}, viewer) {
    const environmentUser = await EnvironmentUsers.findOne(environmentUserId)
    await environmentUser.update({$set: {profile}})
    return environmentUser
  }
})
