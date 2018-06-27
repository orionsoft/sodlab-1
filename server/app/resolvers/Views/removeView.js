import Views from 'app/collections/Views'
import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    viewId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({viewId}, viewer) {
    await Views.remove(viewId)
    return true
  }
})
