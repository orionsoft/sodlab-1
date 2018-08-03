import {resolver} from '@orion-js/app'
import Role from 'app/models/Role'
import Roles from 'app/collections/Roles'
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
      description: 'Solo puede haber un rol con este nombre',
      async custom(name, {doc}) {
        const role = await Roles.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: doc.environmentId
        })
        if (role) return 'notUnique'
      }
    }
  },
  returns: Role,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name}, viewer) {
    const roleId = await Roles.insert({
      name,
      environmentId,
      createdAt: new Date()
    })
    return await Roles.findOne(roleId)
  }
})
