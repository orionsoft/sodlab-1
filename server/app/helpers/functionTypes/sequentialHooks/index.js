import Collections from 'app/collections/Collections'
import Hooks from 'app/collections/Hooks'
import Promise from 'bluebird'

export default {
  name: 'Ejecutar hooks secuenciales',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    hookIds: {
      label: 'Hooks a ejecutar',
      type: ['ID'],
      fieldType: 'hookSelect',
      fieldOptions: {multi: true}
    },
    usePreviousResult: {
      label: '¿Usar resultado del hook anterior?',
      type: String,
      fieldType: 'select',
      fixed: true,
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      }
    },
    stopIfError: {
      label: '¿Detener la ejecución si ocurre un error?',
      type: String,
      fieldType: 'select',
      fixed: true,
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      }
    }
  },
  async execute({options, params, environmentId, userId}) {
    const {collectionId, hookIds, usePreviousResult, stopIfError} = options

    let hooks = []
    const collection = await Collections.findOne(collectionId)
    const db = await collection.db()
    const item = await db.findOne(params._id)
    let newParams = {_id: params._id, ...item.data}

    try {
      await Promise.each(hookIds, async function(hookId) {
        try {
          const hook = await Hooks.findOne(hookId)
          hooks.push(hook)
        } catch (err) {
          console.log(`Error finding hook with id ${hookId} in environment ${environmentId}`, err)
          return {success: false}
        }
      })
    } catch (err) {
      console.log(`Error finding hooks to execute sequentially in ${environmentId}`, err)
      return {success: false}
    }

    try {
      await Promise.each(hooks, async function(hook) {
        let result

        try {
          result = await hook.execute({params: newParams, userId})
        } catch (err) {
          console.log(
            `Error trying to execute sequentially the hook: ${hook.name} from env ${
              hook.environmentId
            }, err:`,
            err
          )
        }

        if (stopIfError && !result.success) {
          throw new Error(
            `Exited the sequential hook, the hook ${
              hook.name
            } failed its execution in environment ${environmentId}`
          )
        }

        if (usePreviousResult && result.success) {
          newParams = {...newParams, previousResult: result.data}
        }

        return
      })
    } catch (err) {
      console.log(`Error executing sequential hooks in ${environmentId}`, err)
      return {success: false}
    }

    return {success: true, data: {...newParams}}
  }
}
