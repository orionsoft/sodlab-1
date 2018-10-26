import {resolver} from '@orion-js/app'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'
import Environments from 'app/collections/Environments'
import Environment from 'app/models/Environment'

export default resolver({
  params: {},
  returns: [Environment],
  async resolve(user, params, viewer) {
    const environmentsByUser = await EnvironmentUsers.find({userId: user._id}).toArray()
    const environments = await Promise.all(
      environmentsByUser.map(environment => {
        return Environments.findOne(environment.environmentId)
      })
    )

    return environments.filter(environment => environment)
  }
})
