import {resolver} from '@orion-js/app'
import Hook from 'app/models/Hook'
import Hooks from 'app/collections/Hooks'

export default resolver({
  returns: [Hook],
  async resolve(form, params, viewer) {
    const hooksIds = form.afterHooksIds
    if (!hooksIds || !hooksIds.length) return []
    const hooks = await Hooks.find({_id: {$in: hooksIds}}).toArray()
    // sort maybe?
    return hooks
  }
})
