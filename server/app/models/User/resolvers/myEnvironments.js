import {resolver} from '@orion-js/app'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export default resolver({
  params: {},
  returns: [String],
  async resolve(user, params, viewer) {
    const environmentsByUser = await EnvironmentUsers.find({userId: user._id}).toArray()
    const environments = environmentsByUser.map(environmet => {
      return environmet.environmentId
    })

    return environments
  }
})
