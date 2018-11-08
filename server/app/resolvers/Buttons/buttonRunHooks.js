import {resolver} from '@orion-js/app'
import {requireTwoFactor} from '@orion-js/auth'
import Buttons from 'app/collections/Buttons'
import Hooks from 'app/collections/Hooks'
import Users from 'app/collections/Users'

export default resolver({
  params: {
    buttonId: {
      type: 'ID',
      optional: true
    },
    parameters: {
      type: 'blackbox',
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({buttonId, parameters}, viewer) {
    const {userId} = viewer
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

    const hooks = await Hooks.find({_id: {$in: button.afterHooksIds}}).toArray()

    const params = {...parameters, ...button.parameters}
    for (const hook of hooks) {
      try {
        await hook.execute({params, userId})
      } catch (e) {
        console.log('Error running hook', e)
      }
    }
    return true
  }
})
