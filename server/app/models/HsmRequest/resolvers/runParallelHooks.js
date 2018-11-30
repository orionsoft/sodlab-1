import {resolver} from '@orion-js/app'
import Hooks from 'app/collections/Hooks'

export default resolver({
  params: {
    item: {
      type: 'blackbox'
    },
    success: {
      type: Boolean
    }
  },
  returns: 'blackbox',
  private: true,
  async resolve(hsmRequest, {item, success}, viewer) {
    let hooks
    if (success) {
      if (!hsmRequest.onSuccessHooksIds) return
      hooks = await Hooks.find({_id: {$in: hsmRequest.onSuccessHooksIds}}).toArray()
    } else {
      if (!hsmRequest.onErrorHooksIds) return
      hooks = await Hooks.find({_id: {$in: hsmRequest.onErrorHooksIds}}).toArray()
    }

    const userId = hsmRequest.erpUserId
    const params = {_id: item._id, ...item.data}

    hooks.map(async function(hook) {
      try {
        await hook.execute({params, userId})
      } catch (e) {
        console.log('Error running hook', e)
      }
    })
  }
})
