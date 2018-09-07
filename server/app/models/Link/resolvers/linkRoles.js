import {resolver} from '@orion-js/app'
import Roles from 'app/collections/Roles'

export default resolver({
  returns: ['blackbox'],
  async resolve(link, params, viewer) {
    if (link.type === 'path') {
      if (!link.roles || !link.roles.length) return []
      return await Roles.find({_id: {$in: link.roles}}).toArray()
    } else {
      let roles = []
      for (const field of link.fields) {
        let roleFields = []
        for (const role of field.roles) {
          const fieldRole = await Roles.findOne(role)
          roleFields.push(fieldRole)
        }
        const roleNames = roleFields.map(newField => {
          return newField.name
        })
        roles.push({title: field.title, roles: (roleNames || []).join(', ')})
      }
      return roles
    }
  }
})
