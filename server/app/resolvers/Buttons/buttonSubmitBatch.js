import {resolver} from '@orion-js/app'
import {requireTwoFactor} from '@orion-js/auth'
import Users from 'app/collections/Users'
import Buttons from 'app/collections/Buttons'
import buttonRunHooks from './buttonRunHooks'
import buttonSubmitHsm from './buttonSubmitHsm'
import tableResult from 'app/resolvers/Tables/tableResult'

export default resolver({
  params: {
    buttonId: {
      type: 'ID',
      optional: true
    },
    parameters: {
      type: ['blackbox'],
      optional: true
    },
    type: {
      type: String,
      optional: true
    },
    params: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: 'blackbox',
  mutation: true,
  async resolve({buttonId, parameters: items, type, params}, viewer) {
    const button = await Buttons.findOne(buttonId)

    if (Object.keys(viewer).length !== 0) {
      const user = await Users.findOne({_id: viewer.userId})
      const twoFactor = await user.hasTwoFactor()
      if (!twoFactor && button.requireTwoFactor) {
        throw new Error('Necesitas activar autenticación de dos factores en "Mi Cuenta"')
      }
    }

    if (button.requireTwoFactor) {
      await requireTwoFactor(viewer)
    }
    const getItems = await tableResult(params)
    const arrayItems = await getItems.cursor.toArray()
    const itemsObject = items[0]
    const broughtItems = Object.keys(itemsObject)
      .map(key => {
        const value = itemsObject[key]
        return {key, value}
      })
      .filter(item => item.value)
      .map(item => item.key)

    const obtainedItems = await arrayItems.filter(item => broughtItems.includes(item._id))

    if (!obtainedItems.length) return

    console.log(
      `Going to execute a ${type} batch operation with ${
        obtainedItems.length
      } items from a total of ${arrayItems.length}`
    )

    let response = {}
    switch (type) {
      case 'button':
        console.log('Executing button buttonRunHooks')
        response = await buttonRunHooks({button, obtainedItems}, viewer)
        break
      case 'icon':
        console.log('Executing icon buttonRunHooks')
        response = await buttonRunHooks({button, obtainedItems}, viewer)
        break
      case 'text':
        console.log('Executing text buttonRunHooks')
        response = await buttonRunHooks({button, obtainedItems}, viewer)
        break
      case 'postItemToUrl':
        console.log('Executing postItemToUrl buttonRunHooks')
        response = await buttonRunHooks({button, obtainedItems}, viewer)
        break
      case 'hsm':
        console.log('Executing buttonSubmitHsm')
        response = await buttonSubmitHsm({button, obtainedItems}, viewer)
        break
      default:
        console.log('invalid button type')
        break
    }

    return response
  }
})
