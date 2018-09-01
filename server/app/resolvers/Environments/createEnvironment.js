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
      label: 'Nombre',
      description: 'Solo puede haber un ambiente con este nombre',
      async custom(name) {
        const result = await Environments.findOne({name: {$regex: `^${name}$`, $options: 'i'}})
        if (result) return 'notUnique'
      }
    },
    url: {
      type: String,
      label: 'URL'
    }
  },
  returns: Environment,
  mutation: true,
  role: 'superAdmin',
  async resolve({_id, name, url}, viewer) {
    const envId = await Environments.insert({_id, name, url, createdAt: new Date()})
    return await Environments.findOne(envId)
  }
})
