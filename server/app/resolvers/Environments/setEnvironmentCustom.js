import {resolver} from '@orion-js/app'
import Environments from 'app/collections/Environments'
import Environment from 'app/models/Environment'

const EnvironmentInput = Environment.clone({
  name: 'EnvironmentConfig',
  pickFields: ['logo', 'authBackgroundImage', 'fontName', 'sideBarColor', 'sideBarTextColor']
})

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    },
    custom: {
      type: EnvironmentInput
    }
  },
  returns: Environment,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, custom}, viewer) {
    const item = await Environments.findOne(environmentId)
    await item.update({$set: custom})
    return item
  }
})
