import {resolver} from '@orion-js/app'
import Role from 'app/models/Role'
import Roles from 'app/collections/Roles'

export default resolver({
  params: {
    roleId: {
      type: 'ID'
    }
  },
  returns: Role,
  async resolve({roleId}, viewer) {
    return await Roles.findOne(roleId)
  }
})
