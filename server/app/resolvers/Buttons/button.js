import {resolver} from '@orion-js/app'
import Button from 'app/models/Button'
import Buttons from 'app/collections/Buttons'

export default resolver({
  params: {
    buttonId: {
      type: 'ID'
    }
  },
  returns: Button,
  async resolve({buttonId}, viewer) {
    return await Buttons.findOne(buttonId)
  }
})
