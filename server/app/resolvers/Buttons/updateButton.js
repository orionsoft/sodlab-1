import {resolver} from '@orion-js/app'
import Button from 'app/models/Button'
import Buttons from 'app/collections/Buttons'

export default resolver({
  params: {
    buttonId: {
      type: 'ID'
    },
    button: {
      type: Button.clone({
        name: 'UpdateButton',
        omitFields: ['_id', 'environmentId', 'createdAt']
      })
    }
  },
  returns: Button,
  mutation: true,
  role: 'admin',
  async resolve({buttonId, button: buttonData}, viewer) {
    console.log(buttonData)
    const button = await Buttons.findOne(buttonId)
    await button.update({$set: buttonData})
    return button
  }
})
