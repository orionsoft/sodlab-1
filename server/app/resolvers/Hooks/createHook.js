import {resolver} from '@orion-js/app'
import Hook from 'app/models/Hook'
import Hooks from 'app/collections/Hooks'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    name: {
      type: String,
      label: 'Nombre',
      description: 'Solo puede haber un hook con este nombre',
      async custom(name, {doc}) {
        const hook = await Hooks.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: doc.environmentId
        })
        if (hook) return 'notUnique'
      }
    }
  },
  returns: Hook,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name}, viewer) {
    const hookId = await Hooks.insert({
      environmentId,
      name,
      createdAt: new Date()
    })
    return await Hooks.findOne(hookId)
  }
})
