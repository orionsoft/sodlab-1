import {resolver} from '@orion-js/app'
import Roles from 'app/collections/Roles'
import Role from 'app/models/Role'

export default resolver({
  returns: [Role],
  async resolve(link, params, viewer) {
    if (link.type === 'path') {
      if (!link.roles || !link.roles.length) return []
      return await Roles.find({_id: {$in: link.roles}}).toArray()
    } else {
      let roles = []
      if (!link.fields) return []
      for (const field of link.fields) {
        roles = [...new Set([...roles, ...field.roles])]
      }
      return await Roles.find({_id: {$in: roles}}).toArray()
    }
  }
})
