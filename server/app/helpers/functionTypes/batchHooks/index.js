import Collections from 'app/collections/Collections'
import Filters from 'app/collections/Filters'
import {hookStart, throwHookError, runSequentialHooks} from '../helpers'
import {parseFilterOptions} from './parseFilterOptions'

export default {
  name: 'Ejecutar hooks en batch',
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
    collectionToGetItems: {
      label: 'Collección sobre la cual se ejecutarán los hooks',
      type: String,
      fieldType: 'collectionSelect'
    },
    filterId: {
      label: '(opcional) Filtro',
      type: String,
      fieldType: 'filterSelect',
      optional: true
    },
    rawFilterOptions: {
      label:
        '(opcional) Variables a entregar a los filtros en formato JSON, ej: {"pedidoId": "param._id","rutCliente": "item.rutCliente"}',
      type: String,
      fieldType: 'textArea',
      optional: true
    },
    hooksIds: {
      label: 'Hooks a ejecutar sobre cada item',
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
  async execute({options, params, environmentId, hook, hooksData, userId, viewer}) {
    const {
      collectionId,
      itemId,
      rawFilterOptions,
      collectionToGetItems,
      filterId,
      hooksIds,
      stopIfError
    } = options
    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      return throwHookError(err)
    }

    let items = []
    try {
      const collection = await Collections.findOne(collectionToGetItems)
      const db = await collection.db()
      if (filterId) {
        const filterOptions = parseFilterOptions({
          rawFilterOptions,
          params,
          item: {_id: item._id, ...item.data}
        })
        const filter = await Filters.findOne(filterId)
        const query = await filter.createQuery({filterOptions}, viewer)
        items = await db.find(query).toArray()
      } else {
        items = await db.find({}).toArray()
      }

      await Promise.all(
        items.map(
          async item =>
            await runSequentialHooks({
              hooksIds,
              params: {_id: item._id, ...item.data},
              userId,
              shouldStopHooksOnError: stopIfError,
              environmentId
            })
        )
      )
    } catch (err) {
      console.log(`Error trying to get items to run hooks on inside the hook ${hook.name}`, err)
      return throwHookError(err)
    }

    return {start: item, result: item, success: true}
  }
}
