import {resolver} from '@orion-js/app'
import Role from 'app/models/Role'
import Roles from 'app/collections/Roles'

export default resolver({
  returns: [Role],
  async resolve(view, params, viewer) {
    if (!view.roles || !view.roles.length) return []
    return await Roles.find({_id: {$in: view.roles}}).toArray()
  }
})
