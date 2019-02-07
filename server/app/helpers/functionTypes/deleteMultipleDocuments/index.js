import Collections from 'app/collections/Collections'
import Indicators from 'app/collections/Indicators'
import {hookStart, parseValueType, throwHookError, getParamFromItem} from '../helpers'

export default {
  name: 'Borrar documentos en base a una condición',
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
    collectionToDelete: {
      type: 'ID',
      label: 'Coleccción de los items a borrar',
      fieldType: 'collectionSelect'
    },
    field: {
      label: 'Campo en donde buscar el valor',
      type: String,
      parentCollection: 'collectionToDelete',
      fieldType: 'collectionFieldSelect'
    },
    valueType: {
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
    value: {
      label:
        '(opcional) Valor a buscar (para acceder a algún valor del item encontrado, seleccionar valor fijo y escribir "item.{nombreDelParámetro}")',
      type: String,
      optional: true
    },
    indicatorId: {
      label: '(opcional) Indicador a usar como valor (predomina sobre el campo "Valor a buscar"',
      type: 'ID',
      fieldType: 'indicatorSelect',
      optional: true
    },
    indicatorParamName: {
      label: '(opcional) Nombre del parametro del ID para pasarlo a indicadores',
      type: String,
      optional: true
    },
    indicatorItemId: {
      label:
        '(opcional) ID del item a pasar al indicador (para acceder a algún valor del item encontrado, seleccionar valor fijo y escribir "item.{nombreDelParámetro}")',
      type: String,
      optional: true
    }
  },
  async execute({
    options: {
      collectionId,
      itemId,
      collectionToDelete,
      field,
      valueType,
      value: originalValue,
      indicatorId,
      indicatorParamName,
      indicatorItemId
    },
    environmentId,
    userId,
    hook,
    hooksData,
    viewer
  }) {
    const {shouldThrow} = hook
    let item = {}
    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      return throwHookError(err)
    }
    let db
    let items = []

    let valueToCheck
    if (indicatorId) {
      try {
        const indicator = await Indicators.findOne(indicatorId)
        const itemId = getParamFromItem(indicatorItemId, item)
        const params = {
          _id: item._id,
          ...item.data,
          [indicatorParamName]: itemId
        }

        valueToCheck = await indicator.result({filterOptions: params, params, userId})
      } catch (err) {
        console.log(`Error in delete multiple items hook, indicator error`, err)
        return throwHookError(err)
      }
    } else {
      const value = getParamFromItem(originalValue, item)
      valueToCheck = value
    }

    valueToCheck = parseValueType(valueType, valueToCheck)

    try {
      const collection = await Collections.findOne(collectionToDelete)
      db = await collection.db()
      items = await db.find({[`data.${field}`]: valueToCheck}).toArray()
    } catch (err) {
      console.log(
        `Error finding items to delete from collection ${collectionId} in environment ${environmentId}`
      )
      return throwHookError(err)
    }

    await Promise.all(
      items.map(async item => {
        try {
          await db.remove(item._id)
        } catch (err) {
          console.log(
            `Error when trying to remove item with ID ${
              item._id
            } from collection with ID ${collectionId} from env ${environmentId}, err:`,
            err
          )
          return throwHookError(err)
        }
      })
    ).catch(err => {
      console.log(
        'Error in delete multiple documents hook. An error ocurred when deleting the documents',
        err
      )
      return throwHookError(err)
    })

    return {start: item, result: item, success: true}
  }
}
