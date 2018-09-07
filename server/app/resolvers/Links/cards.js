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
      const links = await Links.find(query)
        .rawCursor.collation({locale: 'es'})
        .sort({position: 1, title: 1})
        .toArray()

      let cards = []

      links.map(link => {
        if (link.type === 'path' && link.showInHome) {
          cards.push(
            destruct(['icon', 'sizeLarge', 'sizeMedium', 'sizeSmall', 'title', 'path'], link)
          )
        }
        if (link.type === 'category') {
          link.fields
            .filter(field => {
              return field.showInHome
            })
            .map(field => {
              cards.push(
                destruct(['icon', 'sizeLarge', 'sizeMedium', 'sizeSmall', 'title', 'path'], field)
              )
            })
        }
      })
      return cards
    }

    let envUserRoles = null
    if (!viewer.roles.includes('admin')) {
      const environmentUser = await EnvironmentUsers.findOne({userId: viewer.userId, environmentId})
      envUserRoles = environmentUser && environmentUser.roles
      query['$or'] = [
        {type: 'path', roles: envUserRoles ? {$in: envUserRoles} : {$in: []}},
        {
          type: 'category',
          fields: {$elemMatch: {roles: envUserRoles ? {$in: envUserRoles} : {$in: []}}}
        }
      ]
    }

    const links = await Links.find(query)
      .rawCursor.collation({locale: 'es'})
      .sort({position: 1, title: 1})
      .toArray()
    let cards = []
    links.map(link => {
      if (link.type === 'path' && link.showInHome) {
        cards.push(
          destruct(['icon', 'sizeLarge', 'sizeMedium', 'sizeSmall', 'title', 'path'], link)
        )
      }
      if (link.type === 'category') {
        link.fields
          .filter(field => {
            return (
              envUserRoles &&
              field.roles.some(role => envUserRoles.includes(role)) &&
              field.showInHome
            )
          })
          .map(field => {
            cards.push(
              destruct(['icon', 'sizeLarge', 'sizeMedium', 'sizeSmall', 'title', 'path'], field)
            )
          })
      }
    })
    return cards
  }
})
