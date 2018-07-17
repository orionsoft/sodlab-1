import Roles from 'app/collections/Roles'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    roleId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({roleId}, viewer) {
    await Roles.remove(roleId)
    return true
  }
})
