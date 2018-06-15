import {resolver} from '@orion-js/app'
import Environment from 'app/models/Environment'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    },
    config: {
      type: Environment.clone({
        name: 'EnvironmentConfig',
        pickFields: ['name', 'url', 'logo', 'authBackgroundImage']
      })
    }
  },
  returns: Environment,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, config}, viewer) {
    const environment = await Environments.findOne(environmentId)
    await environment.update({$set: config})
    return environment
  }
})