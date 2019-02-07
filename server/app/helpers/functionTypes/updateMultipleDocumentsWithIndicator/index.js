import Collections from 'app/collections/Collections'
import Indicators from 'app/collections/Indicators'
import {hookStart, parseValueType, throwHookError, getParamFromItem} from '../helpers'

export default {
  name: 'Actualizar multiples items con un valor con un indicador',
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
      label:
        'Valor a buscar (para acceder a algún valor del item encontrado, seleccionar valor fijo y escribir "item.{nombreDelParámetro}")',
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
    indicatorId: {
      type: String,
      label: 'Indicador',
      fieldType: 'indicatorSelect'
    },
    indicatorParamName: {
      type: String,
      label: '(opcional) Nombre del parametro del ID para pasarlo a indicadores',
      optional: true
    },
    indicatorItemId: {
      type: String,
      label:
        '(opcional) ID a pasar al indicador (para acceder a algún valor del item encontrado, seleccionar valor fijo y escribir "item.{nombreDelParámetro}")',
      optional: true
    }
  },
  async execute({options, hook, hooksData, viewer, environmentId, userId}) {
    const {
      collectionId,
      itemId,
      collectionToUpdate,
      field,
      fieldValueToLookFor,
      fieldValueToLookForType,
      valueKey,
      indicatorId,
      indicatorParamName,
      indicatorItemId
    } = options

    const {shouldThrow} = hook
    let item = {}
    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      return throwHookError(err)
    }

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
        let value
        try {
          const indicator = await Indicators.findOne(indicatorId)
          const itemId = getParamFromItem(indicatorItemId, item)
          const params = {
            ...item.data,
            [indicatorParamName]: itemId
          }
          value = await indicator.result({filterOptions: params, params, userId})
        } catch (err) {
          console.log(
            `Error getting the value from an indicator to update an item in ${collectionId} in environment ${environmentId}`
          )
          return throwHookError(err)
        }

        try {
          await item.update({$set: {[`data.${valueKey}`]: value}})
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
