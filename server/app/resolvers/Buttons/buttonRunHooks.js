import {resolver} from '@orion-js/app'
import {runParallelHooks} from 'app/helpers/functionTypes/helpers'

export default resolver({
  params: {
    button: {
      type: 'blackbox'
    },
    obtainedItems: {
      type: ['blackbox'],
      optional: true
    },
    parameters: {
      type: 'blackbox',
      optional: true
    },
    singular: {
      type: Boolean,
      optional: true,
      defaultValue: false
    }
  },
  returns: Boolean,
  mutation: true,
  async resolve({button, obtainedItems, parameters, singular}, viewer) {
    const {userId} = viewer
    const hooksIds = button.afterHooksIds

    if (singular) {
      await runParallelHooks({
        hooksIds,
        params: {...parameters},
        userId
      })
    } else {
      obtainedItems.map(async item => {
        const params = {_id: item._id, ...item.data}

        await runParallelHooks({hooksIds, params, userId})
      })
    }

    return true
  }
})
