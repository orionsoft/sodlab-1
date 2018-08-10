import {resolver} from '@orion-js/app'
import Hook from 'app/models/Hook'
import Hooks from 'app/collections/Hooks'

export default resolver({
  returns: [Hook],
  async resolve(form, params, viewer) {
    const hooksIds = form.afterHooksIds
    if (!hooksIds || !hooksIds.length) return []
    const hooks = Promise.all(
      hooksIds.map(async hookId => {
        return await Hooks.findOne(hookId)
      })
    )
    // sort maybe?
    return hooks
  }
})
