import {resolver} from '@orion-js/app'
import Hook from 'app/models/Hook'
import Hooks from 'app/collections/Hooks'

export default resolver({
  returns: [Hook],
  async resolve(form, params, viewer) {
    const hooksIds = form.afterHooksIds
    if (!hooksIds || !hooksIds.length) return []
    const hooksFound = await Promise.all(hooksIds.map(async hookId => await Hooks.findOne(hookId)))
    const hooks = hooksFound.filter(hook => hook)
    return hooks
  }
})
