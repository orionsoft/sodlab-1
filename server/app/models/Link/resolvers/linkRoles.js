import {resolver} from '@orion-js/app'
import Role from 'app/models/Role'
import Roles from 'app/collections/Roles'

export default resolver({
  returns: [Role],
  async resolve(link, params, viewer) {
    if (!link.roles || !link.roles.length) return []
    return await Roles.find({_id: {$in: link.roles}}).toArray()
  }
})
