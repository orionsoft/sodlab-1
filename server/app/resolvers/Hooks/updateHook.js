import {resolver} from '@orion-js/app'
import Hook from 'app/models/Hook'
import Hooks from 'app/collections/Hooks'

export default resolver({
  params: {
    hookId: {
      type: 'ID'
    },
    hook: {
      type: Hook.clone({
        name: 'UpdateHook',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Hook,
  mutation: true,
  async resolve({hookId, hook: hookData}, viewer) {
    const hook = await Hooks.findOne(hookId)
    await hook.update({$set: hookData})
    return hook
  }
})
