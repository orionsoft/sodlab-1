import {resolver} from '@orion-js/app'
import Hooks from 'app/collections/Hooks'

export default resolver({
  params: {
    hookId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({hookId}, viewer) {
    await Hooks.remove(hookId)
    return true
  }
})
