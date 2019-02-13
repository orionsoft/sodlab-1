import getResult from 'app/resolvers/Forms/submitForm/getResult'
import runHooks from 'app/resolvers/Forms/submitForm/runHooks'
import Collections from 'app/collections/Collections'
import Forms from 'app/collections/Forms'
import parseTemplate from './parseTemplate'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'

export default {
  name: 'Crear/Actualizar documento en otra colección',
  optionsSchema: {
    sourceCollectionId: {
      label: 'Coleccion de origen',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
    template: {
      type: String,
      label:
        'Template en formato JSON {"campoOrigen":{"type": "fixed|param", "field":"nombreCompleto", "value":"Luke Skywalker"(sólo aplica si type=fixed)}}',
      fieldType: 'textArea'
    },
    targetCollectionId: {
      label: 'Colección de destino',
      type: String,
      fieldType: 'collectionSelect'
    },
    actionType: {
      label:
        '(opcional) Tipo de acción (sólo si los datos si insertan directamente a la colección) (default: Crear)',
      type: String,
      fieldType: 'select',
      defaultValue: 'create',
      fieldOptions: {
        options: [{label: 'Crear', value: 'create'}, {label: 'Actualizar', value: 'update'}]
      },
      optional: true
    },
    formId: {
      label: '(opcional) Usar un formulario para el ingreso de datos',
      type: String,
      fieldType: 'formSelect',
      optional: true
    },
    itemToUpdateId: {
      label:
        '(opcional) Campo de la colección de origen en donde está el ID del documento de la colección de destino. Sólo a usar si se actualizará un item.',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'sourceCollectionId',
      optional: true
    },
    shouldRunHooks: {
      label: 'Ejecutar hooks del formulario (default: No)',
      type: Boolean,
      fieldType: 'select',
      defaultValue: false,
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      optional: true
    },
    resultingIdField: {
      label:
        '(opcional) Campo de la colección de origen en donde guardar el ID del nuevo documento',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'sourceCollectionId',
      optional: true
    }
  },
  async execute({options, environmentId, userId, hook, hooksData, viewer}) {
    const {
      actionType,
      sourceCollectionId,
      itemId,
      targetCollectionId,
      shouldRunHooks,
      resultingIdField
    } = options
    const template = JSON.parse(options.template)
    const {shouldThrow} = hook
    let item = {}
    let data = {}

    try {
      item = await hookStart({
        shouldThrow,
        itemId,
        hooksData,
        collectionId: sourceCollectionId,
        hook,
        viewer
      })

      data = await parseTemplate({sourceItem: item, template, userId, environmentId})
    } catch (err) {
      console.log(
        'Error executing Create/Update doc hook. An error ocurring trying to parse the template',
        err
      )
      return throwHookError(err)
    }

    const targetCol = await Collections.findOne(targetCollectionId)
    const targetDb = await targetCol.db()

    let newItemId = ''
    try {
      if (!options.formId) {
        if (actionType === 'create') {
          newItemId = await targetDb.insert({
            data,
            createdAt: new Date()
          })
        } else {
          const item = await targetDb.findOne(options.itemToUpdateId)
          const updateOperation = Object.keys(data).map(async key => {
            await item.update({$set: {[`data.${key}`]: data[key]}})
          })
          await Promise.all(updateOperation)
          newItemId = item._id
        }
      } else {
        const {formId} = options
        const form = await Forms.findOne(formId)
        if (form.type === 'create') {
          const item = await getResult({form, data})
          if (shouldRunHooks) await runHooks({form, item, userId})
          newItemId = item._id
        } else {
          const item = await getResult({form, data, itemId: options.itemToUpdateId})
          if (shouldRunHooks) await runHooks({form, item, userId})
          newItemId = item._id
        }
      }

      if (resultingIdField) {
        await item.update({$set: {[`data.${resultingIdField}`]: newItemId}})
      }
    } catch (err) {
      console.log('Error executing Create/Update doc hook. When trying to create the new item', err)
      return throwHookError(err)
    }

    const newItem = await getItemFromCollection({
      collectionId: sourceCollectionId,
      itemId: item._id
    })
    return {start: item, result: newItem, success: true}
  }
}
