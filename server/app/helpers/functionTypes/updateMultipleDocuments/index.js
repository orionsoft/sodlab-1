import Collections from 'app/collections/Collections'
import {hookStart, parseValueType, throwHookError, getParamFromItem} from '../helpers'

export default {
  name: 'Actualizar multiples items con un valor',
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
    collectionToUpdate: {
      type: 'ID',
      label: 'Coleccción del item a actualizar',
      fieldType: 'collectionSelect'
    },
    field: {
      label: 'Campo en donde buscar el valor',
      type: String,
      parentCollection: 'collectionToUpdate',
      fieldType: 'collectionFieldSelect'
    },
    fieldValueToLookFor: {
      label: 'Valor a buscar',
      type: String
    },
    fieldValueToLookForType: {
      label: '(opcional) Formato del valor a buscar. Por defecto se usará el formato Texto',
      type: String,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Texto', value: 'string'},
          {label: 'Número', value: 'number'},
          {label: 'Verdadero/False', value: 'boolean'}
        ]
      },
      defaultValue: 'string',
      optional: true
    },
    valueKey: {
      type: String,
      label: 'Campo a actualizar',
      parentCollection: 'collectionToUpdate',
      fieldType: 'collectionFieldSelect'
    },
    value: {
      type: String,
      label: 'Valor a insertar',
      parentCollection: 'collectionToUpdate',
      fieldType: 'collectionFieldSelect'
    },
    fieldValue: {
      type: String,
      label:
        '(opcional) Valor del campo a insertar (para acceder a algún valor del item encontrado, seleccionar valor fijo y escribir "item.{nombreDelParámetro}")',
      fieldType: 'fieldOptions',
      parentCollection: 'collectionToUpdate',
      parentField: 'value',
      optional: true
    },
    useParam: {
      type: Boolean,
      label: '(opcional) Usar Parámetro',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      defaultValue: false,
      optional: true
    },
    valueType: {
      label: '(opcional) Formato del valor a insertar. Por defecto se usará el formato Texto',
      type: String,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Texto', value: 'string'},
          {label: 'Número', value: 'number'},
          {label: 'Verdadero/False', value: 'boolean'}
        ]
      },
      defaultValue: 'string',
      optional: true
    }
  },
  async execute({options, environmentId, hook, hooksData, viewer}) {
    const {
      collectionId,
      itemId,
      collectionToUpdate,
      field,
      fieldValueToLookFor,
      fieldValueToLookForType,
      valueKey,
      value,
      fieldValue: originalFieldValue,
      useParam,
      valueType
    } = options

    const {shouldThrow} = hook
    let item = {}
    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      return throwHookError(err)
    }

    let db
    let items = []
    const valueToLookFor = getParamFromItem(fieldValueToLookFor, item)
    const valueToCheck = parseValueType(fieldValueToLookForType, valueToLookFor)
    try {
      const collection = await Collections.findOne(collectionToUpdate)
      db = await collection.db()
      if (field === '_id') {
        items = await db.find({_id: valueToCheck}).toArray()
      } else {
        items = await db.find({[`data.${field}`]: valueToCheck}).toArray()
      }
    } catch (err) {
      console.log(
        `Error finding items to update from collection ${collectionId} in environment ${environmentId}`
      )
      return throwHookError(err)
    }

    await Promise.all(
      items.map(async item => {
        const fieldValue = getParamFromItem(originalFieldValue, item)
        const newValue = useParam ? value : fieldValue ? fieldValue : item.data[value]
        const formattedValue = parseValueType(valueType, newValue)

        try {
          await item.update({$set: {[`data.${valueKey}`]: formattedValue}})
        } catch (err) {
          console.log(
            `Error when trying to update item with ID ${
              item._id
            } from collection with ID ${collectionId} from env ${environmentId}, err:`,
            err
          )
          return throwHookError(err)
        }
      })
    ).catch(err => {
      console.log(
        'Error in update multiple documents hook. An error ocurred when deleting the documents',
        err
      )
      return throwHookError(err)
    })

    return {start: item, result: item, success: true}
  }
}
