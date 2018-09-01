import {resolver} from '@orion-js/app'
import escape from 'escape-string-regexp'
import Links from 'app/collections/Links'
import EnvironmentUsers from 'app/collections/EnvironmentUsers'

export const destruct = function(keys, obj) {
  return keys.reduce((a, c) => ({...a, [c]: obj[c]}), {})
}

export default resolver({
  returns: ['blackbox'],
  params: {
    filter: {
      type: String,
      optional: true
    },
    environmentId: {
      type: 'ID'
    }
  },
  async resolve({filter, environmentId}, viewer) {
    const query = {environmentId}
    if (viewer.roles.includes('admin')) {
      if (filter) {
        query.title = {$regex: new RegExp(`^${escape(filter)}`)}
      }
      return await Links.find(query)
        .rawCursor.collation({locale: 'es'})
        .sort({position: 1, title: 1})
        .toArray()
    }

    let envUserRoles = null

    const environmentUser = await EnvironmentUsers.findOne({userId: viewer.userId, environmentId})
    envUserRoles = environmentUser && environmentUser.roles
    query['$or'] = [
      {type: 'path', roles: envUserRoles ? {$in: envUserRoles} : {$in: []}},
      {
        type: 'category',
        fields: {$elemMatch: {roles: envUserRoles ? {$in: envUserRoles} : {$in: []}}}
      }
    ]

    if (filter) {
      query.title = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    const links = await Links.find(query)
      .rawCursor.collation({locale: 'es'})
      .sort({position: 1, title: 1})
      .toArray()
    let cards = links.map(link => {
      if (link.type === 'path') {
        return link
      }
      if (link.type === 'category') {
        let newFields = link.fields.filter(field => {
          return envUserRoles && field.roles.some(role => envUserRoles.includes(role))
        })
        if (newFields.length) {
          return {
            title: link.title,
            type: link.type,
            position: link.position,
            fields: newFields
          }
        }
      }
    })
    return cards
  }
})
