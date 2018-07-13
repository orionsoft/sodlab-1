import Roles from 'app/collections/Roles'
import {resolver} from '@orion-js/app'
// import postRemoveRole from 'app/helpers/resolvers/roles/postRemoveRole'

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
    // await postRemoveRole(roleId)
    await Roles.remove(roleId)
    return true
  }
})
