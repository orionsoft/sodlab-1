import {resolver} from '@orion-js/app'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {
    userId: {
      type: 'ID',
      optional: true
    },
    environmentId: {
      type: 'ID',
      optional: true
    }
  },
  returns: Boolean,
  async resolve({userId, environmentId}, viewer) {
    if (!userId || !environmentId) return false
    const data = await EnvironmentUsers.findOne({userId, environmentId})

    return !!data
  }
})
