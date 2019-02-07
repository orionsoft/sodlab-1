import {resolver} from '@orion-js/app'
import Buttons from 'app/collections/Buttons'
import {runSequentialHooks} from 'app/helpers/functionTypes/helpers'

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
  returns: 'blackbox',
  mutation: true,
  async resolve({button: frontButton, obtainedItems, parameters, singular}, viewer) {
    const button = await Buttons.findOne(frontButton._id)
    const {userId} = viewer
    const hooksIds = button.afterHooksIds
    let buttonRunHooksResult = {}
    let results = []
    try {
      if (button.firstHook) {
        const firstHookId = button.firstHook
        if (singular) {
          await runSequentialHooks({
            hooksIds: [firstHookId],
            params: {...parameters},
            userId,
            shouldStopHooksOnError: false,
            environmentId: button.environmentId
          })
        } else {
          const item = obtainedItems[0]
          const params = {_id: item._id, ...item.data}
          await runSequentialHooks({
            hooksIds: [firstHookId],
            params,
            userId,
            shouldStopHooksOnError: false,
            environmentId: button.environmentId
          })
        }
      }

      if (singular) {
        buttonRunHooksResult = await runSequentialHooks({
          hooksIds,
          params: {...parameters},
          userId,
          shouldStopHooksOnError: button.shouldStopHooksOnError,
          environmentId: button.environmentId
        })
      } else {
        const pendingHooks = obtainedItems.map(async item => {
          const params = {_id: item._id, ...item.data}

          return await runSequentialHooks({
            hooksIds,
            params,
            userId,
            shouldStopHooksOnError: button.shouldStopHooksOnError,
            environmentId: button.environmentId
          })
        })

        results = await Promise.all(pendingHooks)
      }

      if (button.lastHook) {
        const lastHookId = button.lastHook
        if (singular) {
          await runSequentialHooks({
            hooksIds: [lastHookId],
            params: {...parameters},
            userId,
            shouldStopHooksOnError: false,
            environmentId: button.environmentId
          })
        } else {
          const item = obtainedItems[0]
          const params = {_id: item._id, ...item.data}
          await runSequentialHooks({
            hooksIds: [lastHookId],
            params,
            userId,
            shouldStopHooksOnError: false,
            environmentId: button.environmentId
          })
        }
      }

      if (singular) {
        const response = await button.getHookResult({buttonRunHooksResult})
        return response
      } else {
        const itemNumber = button.itemNumberResult || results.length || 1
        const response = await button.getHookResult({
          buttonRunHooksResult: results[itemNumber - 1]
        })
        return response
      }
    } catch (err) {
      console.log({
        message: '@@@ An error ocurred when executing a button',
        buttonName: button.name,
        parameters: parameters,
        environmentId: button.environmentId,
        serverTime: new Date(),
        stringifiedError: err.toString(),
        err
      })
      throw err.originalMsg ||
        'No se han podido ejecutar alguna(s) de la funcionalidades adicionales'
    }
  }
})
