import {getItemFromCollection, hookStart, throwHookError, runSequentialHooks} from '../helpers'

export default {
  name: 'Ejecutar hooks secuenciales',
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
    hookIds: {
      label: 'Hooks a ejecutar',
      type: ['ID'],
      fieldType: 'hookSelect',
      fieldOptions: {multi: true}
    },
    stopIfError: {
      label: '(opcional) ¿Detener la ejecución si ocurre un error? (Por defecto no se detendrá)',
      type: Boolean,
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      optional: true,
      defaultValue: false
    }
  },
  async execute({options, userId, hook, hooksData, viewer, environmentId}) {
    const {collectionId, itemId, hookIds, stopIfError} = options

    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      return throwHookError(err)
    }

    let params = {_id: item._id, ...item.data}

    try {
      await runSequentialHooks({
        hooksIds: hookIds,
        params,
        userId,
        shouldStopHooksOnError: stopIfError,
        environmentId
      })
    } catch (err) {
      console.log('Error running the sequential hook', err)
      return throwHookError(err)
    }

    const newItem = await getItemFromCollection({collectionId, itemId: item._id})
    return {start: item, result: newItem, success: true}
  }
}
