import Validations from 'app/collections/Validations'
import {runSequentialHooks} from 'app/helpers/functionTypes/helpers'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'

export default {
  name: 'Switch con validación',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
    validationsIds: {
      type: [String],
      label: 'Validaciones',
      min: 1,
      fieldType: 'validationSelect',
      fieldOptions: {
        multi: true
      }
    },
    passesHooksIds: {
      type: [String],
      label: 'Hooks a ejecutar si pasa la validación',
      fieldType: 'hookSelect',
      fieldOptions: {
        multi: true
      }
    },
    failsHooksIds: {
      type: [String],
      label: 'Hooks a ejecutar si no pasa la validación',
      fieldType: 'hookSelect',
      fieldOptions: {
        multi: true
      }
    },
    shouldStopHooksOnError: {
      type: Boolean,
      label: '(opcional) Detener la ejecución si falla algún hook. Por defecto no se detendra',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      defaultValue: false,
      optional: true
    }
  },
  async execute({
    options: {
      collectionId,
      itemId,
      validationsIds,
      passesHooksIds,
      failsHooksIds,
      shouldStopHooksOnError
    },
    hook,
    hooksData,
    userId,
    viewer,
    environmentId
  }) {
    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({
        shouldThrow,
        itemId,
        hooksData,
        collectionId,
        hook,
        viewer,
        environmentId
      })
    } catch (err) {
      return throwHookError(err)
    }

    let newParams = {_id: item._id, ...item.data}
    let passes = true
    try {
      for (const validationId of validationsIds || []) {
        const validation = await Validations.findOne(validationId)
        await validation.execute({params: newParams, data: newParams})
      }
    } catch (error) {
      console.log(error)
      passes = false
    }

    if (passes) {
      await runSequentialHooks({
        hooksIds: passesHooksIds,
        params: newParams,
        userId,
        shouldStopHooksOnError,
        environmentId
      }).catch(err => {
        console.log(
          `An error ocurred inside the validation switch ${
            hook.name
          }, when executing the one of the hooks that passed the validation`
        )
        return throwHookError(err)
      })
    } else {
      await runSequentialHooks({
        hooksIds: failsHooksIds,
        params: newParams,
        userId,
        shouldStopHooksOnError,
        environmentId
      }).catch(err => {
        console.log(
          `An error ocurred inside the validation switch ${
            hook.name
          }, when executing the one of the hooks that failed the validation`
        )
        return throwHookError(err)
      })
    }

    const newItem = await getItemFromCollection({collectionId, itemId: item._id})
    return {start: item, result: newItem, success: true}
  }
}
