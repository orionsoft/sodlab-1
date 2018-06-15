import {resolver} from '@orion-js/app'
import Environment from 'app/models/Environment'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      description: 'Recieves the environment or the url',
      optional: true
    },
    url: {
      type: String,
      optional: true
    }
  },
  returns: Environment,
  async resolve({environmentId, url}, viewer) {
    if (environmentId && url) {
      throw new Error('You can only pass environmentId or url, but no both at the time')
    }
    if (environmentId) {
      return await Environments.findOne(environmentId)
    } else if (url) {
      return await Environments.findOne({url})
    }
  }
})
