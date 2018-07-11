import {resolver} from '@orion-js/app'
import Field from 'app/models/Field'
import Environments from 'app/collections/Environments'
import Environment from 'app/models/Environment'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    },
    profileSchema: {
      type: [Field]
    }
  },
  returns: Environment,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, profileSchema}, viewer) {
    const environment = await Environments.findOne(environmentId)
    await environment.update({$set: {profileSchema}})
    return environment
  }
})
