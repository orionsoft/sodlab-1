import {resolver} from '@orion-js/app'
import buttonRunHooks from './buttonRunHooks'

export default resolver({
  params: {
    buttonId: {
      type: 'ID',
      optional: true
    },
    parameters: {
      type: ['blackbox'],
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({buttonId, parameters: items}, viewer) {
    for (const parameters of items) {
      await buttonRunHooks({buttonId, parameters}, viewer)
    }
  }
})
