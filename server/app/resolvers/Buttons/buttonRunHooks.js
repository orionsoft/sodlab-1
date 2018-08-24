import {resolver} from '@orion-js/app'
import Buttons from 'app/collections/Buttons'
import Hooks from 'app/collections/Hooks'

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
    const button = await Buttons.findOne(buttonId)
    const hooks = await Hooks.find({_id: {$in: button.afterHooksIds}}).toArray()

    const params = {...parameters, ...button.parameters}
    for (const hook of hooks) {
      try {
        await hook.execute({params})
      } catch (e) {
        console.log('Error running hook', e)
      }
    }
    return true
  }
})
