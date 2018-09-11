import {resolver} from '@orion-js/app'
import Environment from 'app/models/Environment'
import Environments from 'app/collections/Environments'
import changeEnvironment from './changeEnvironment'
import changeIds from './changeIds'
import saveData from './saveData'
import clearData from './clearData'

export default resolver({
  params: {
    environmentId: {
      type: 'ID'
    },
    data: {
      type: String
    }
  },
  returns: Environment,
  mutation: true,
  async resolve({environmentId, data: json}, viewer) {
    const environment = await Environments.findOne(environmentId)
    let data = JSON.parse(json)
    if (data.exportVersion !== 'v3') {
      throw new Error('Archivo incorrecto')
    }

    data = changeEnvironment(environment, data)
    data = changeIds(environment, data)
    await clearData(environment)
    await saveData(environment, data)
    return environment
  }
})
