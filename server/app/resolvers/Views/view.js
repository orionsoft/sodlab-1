import {resolver} from '@orion-js/app'
import View from 'app/models/View'
import Views from 'app/collections/Views'
import Forms from 'app/collections/Forms'
import Tables from 'app/collections/Tables'
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
    }
    if (item.type === 'table') {
      const table = await Tables.findOne(item.tableId)
      if (
        table.roles &&
        table.roles.length &&
        table.roles.some(role => envUserRoles.includes(role))
      ) {
        filteredItems.push(item)
      } else if (!table.roles || !table.roles.length) {
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
      type: 'ID',
      optional: true
    }
  },
  returns: View,
  async resolve({viewId, environmentId}, viewer) {
    if (viewer.roles.includes('admin') || viewer.roles.includes('superAdmin')) {
      return await Views.findOne(viewId)
    }

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
