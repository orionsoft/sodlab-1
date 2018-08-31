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
    if (!viewer.roles.includes('admin')) {
      const environmentUser = await EnvironmentUsers.findOne({userId: viewer.userId, environmentId})
      query.roles = environmentUser ? {$in: environmentUser.roles} : {$in: []}
    }
    if (filter) {
      query.name = {$regex: new RegExp(`^${escape(filter)}`)}
    }
    const links = await Links.find(query)
      .rawCursor.collation({locale: 'es'})
      .sort({position: 1, title: 1})
      .toArray()
    let cards = []
    links.forEach(link => {
      if (link.type === 'path' && link.showInHome) {
        cards.push(
          destruct(['icon', 'sizeLarge', 'sizeMedium', 'sizeSmall', 'title', 'path'], link)
        )
      } else if (link.type === 'category') {
        link.fields
          .filter(field => {
            return field.showInHome
          })
          .map(field => {
            cards.push(field)
          })
      }
    })
    return cards
  }
})
