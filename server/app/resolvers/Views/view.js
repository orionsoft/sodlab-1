import {resolver} from '@orion-js/app'
import View from 'app/models/View'
import Views from 'app/collections/Views'

export default resolver({
  params: {
    viewId: {
      type: 'ID'
    }
  },
  returns: View,
  async resolve({viewId}, viewer) {
    return await Views.findOne(viewId)
  }
})
