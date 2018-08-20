import {resolver} from '@orion-js/app'
import Buttons from 'app/collections/Buttons'

export default resolver({
  params: {
    buttonId: {
      type: 'ID'
    }
  },
  returns: Boolean,
  mutation: true,
  role: 'admin',
  async resolve({buttonId}, viewer) {
    await Buttons.remove(buttonId)
    return true
  }
})
