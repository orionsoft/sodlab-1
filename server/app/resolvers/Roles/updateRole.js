import Roles from 'app/collections/Roles'
import {resolver} from '@orion-js/app'
import Role from 'app/models/Role'

export default resolver({
  params: {
    roleId: {
      type: 'ID'
    },
    role: {
      type: Role.clone({
        name: 'UpdateRole',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Role,
  mutation: true,
  role: 'admin',
  async resolve({roleId, role: roleData}, viewer) {
    const role = await Roles.findOne(roleId)
    await role.update({$set: roleData})
    return role
  }
})
