import {resolver} from '@orion-js/app'
import View from 'app/models/View'
import Views from 'app/collections/Views'
import Forms from 'app/collections/Forms'
import environmentUserByUserId from 'app/resolvers/EnvironmentUsers/environmentUserByUserId'

export const asyncFilter = async function(arr, callback) {
  const fail = Symbol()
  return (await Promise.all(arr.map(async item => ((await callback(item)) ? item : fail)))).filter(
    i => i !== fail
  )
}

export const checkRole = async function(items, envUserRoles) {
  const filteredItems = asyncFilter(items, async item => {
    let form = {}
    if (item.type === 'layout') {
      item.subItems = await checkRole(item.subItems, envUserRoles) // recursive
    }
    if (item.type === 'form') {
      form = await Forms.findOne(item.formId)
    }
    return (
      item.type !== 'form' ||
      (item.type === 'form' &&
        form.roles &&
        form.roles.length &&
        form.roles.some(role => envUserRoles.includes(role)))
    )
  })
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
