import {resolver} from '@orion-js/app'
import Environment from 'app/models/Environment'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    _id: {
      type: 'ID',
      label: 'Namespace',
      description: 'Un nombre único, solo minusculas y números',
      custom(id) {
        if (!/^[a-z0-9]+$/g.test(id)) return 'invalid'
      }
    },
    name: {
      type: String,
      label: 'Nombre'
    }
  },
  returns: Environment,
  mutation: true,
  role: 'admin',
  async resolve({_id, name}, viewer) {
    const envId = await Environments.insert({_id, name, createdAt: new Date()})
    return await Environments.findOne(envId)
  }
})
