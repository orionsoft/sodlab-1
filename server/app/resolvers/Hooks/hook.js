import {resolver} from '@orion-js/app'
import Hook from 'app/models/Hook'
import Hooks from 'app/collections/Hooks'

export default resolver({
  params: {
    hookId: {
      type: 'ID'
    }
  },
  returns: Hook,
  async resolve({hookId}, viewer) {
    return await Hooks.findOne(hookId)
  }
})
