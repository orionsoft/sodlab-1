import {resolver} from '@orion-js/app'
import View from 'app/models/View'
import Views from 'app/collections/Views'
import Forms from 'app/collections/Forms'
import environmentUserByUserId from 'app/resolvers/EnvironmentUsers/environmentUserByUserId'

export const checkRole = async function(items, envUserRoles) {
  let filteredItems = []
  for (const item of items) {
    if (item.type === 'layout') {
      item.subItems = await checkRole(item.subItems, envUserRoles) // recursive
    }
    if (item.type === 'form') {
      const form = await Forms.findOne(item.formId)
      if (form.roles && form.roles.length && form.roles.some(role => envUserRoles.includes(role))) {
        filteredItems.push(item)
      } else if (!form.roles || !form.roles.length) {
        filteredItems.push(item)
      }
    } else {
      filteredItems.push(item)
    }
  }
  return filteredItems
}

export default resolver({
  params: {
    viewId: {
      type: 'ID'
    },
    environmentId: {
      type: 'ID'
    }
  },
  returns: View,
  async resolve({viewId, environmentId}, viewer) {
    const environmentUser = await environmentUserByUserId({
      userId: viewer.userId,
      environmentId
    })
    let view = await Views.findOne(viewId)
    const filteredItems = await checkRole(view.items, environmentUser.roles)
    let finalView = {...view, items: await filteredItems}
    return finalView
  }
})
