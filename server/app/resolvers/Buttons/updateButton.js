import {resolver} from '@orion-js/app'
import Button from 'app/models/Button'
import Buttons from 'app/collections/Buttons'
import cloneDeep from 'lodash/cloneDeep'

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
    if (!buttonData.buttonType) {
      throw Error('Tipo requerido')
    }
    if (
      (buttonData.buttonType === 'button' || buttonData.buttonType === 'text') &&
      !buttonData.buttonText
    ) {
      throw Error('Etiqueta requerida')
    }

    if (buttonData.buttonType === 'icon' && !buttonData.icon) {
      throw Error('Icono requerido')
    }

    let buttonDataCopy = cloneDeep(buttonData)
    if (!buttonDataCopy.url) {
      buttonDataCopy['url'] = null
    }

    const button = await Buttons.findOne(buttonId)
    await button.update({$set: buttonDataCopy})
    return button
  }
})
