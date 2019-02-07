import Collections from 'app/collections/Collections'
import Indicators from 'app/collections/Indicators'
import {hookStart, parseValueType, throwHookError, getItemFromCollection} from '../helpers'

export default {
  name: 'Concatenar valores de items en una colección',
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
    saveToField: {
      label: 'Campo en donde guardar el resultado',
      type: String,
      fieldType: 'collectionFieldSelect'
    },
    targetCollectionId: {
      label: 'Collección de donde se obtendrán los datos',
      type: String,
      fieldType: 'collectionSelect'
    },
    targetField: {
      label: 'Campo que se usará para filtrar los items',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'targetCollectionId'
    },
    valueType: {
      label: 'Tipo del valor a buscar',
      type: String,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Texto', value: 'string'},
          {label: 'Número', value: 'number'},
          {label: 'Verdadero/False', value: 'boolean'}
        ]
      }
    },
    value: {
      label: '(opcional) Valor a buscar',
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
      label: '(opcional) ID del item a pasar al indicador',
      type: String,
      optional: true
    },
    sourceField: {
      label: 'Campo de donde se obtendrá el valor a concatenar',
      type: String,
      fieldType: 'collectionFieldSelect',
      parentCollection: 'targetCollectionId'
    },
    spacer: {
      label: '(opcional) Simbolos a usar para separar los valores',
      type: String,
      optional: true
    },
    useSeparation: {
      label:
        '(opcional) ¿Separar la concatenación de valores y simbolos usando un espacio? (Por defecto si)',
      type: Boolean,
      fieldType: 'select',
      defaultValue: true,
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      optional: true
    }
  },
  async execute({
    options: {
      collectionId,
      itemId,
      valueType,
      value,
      indicatorId,
      indicatorParamName,
      indicatorItemId,
      targetCollectionId,
      targetField,
      sourceField,
      spacer,
      useSeparation,
      saveToField
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

    let valueToCheck
    if (indicatorId) {
      try {
        const indicator = await Indicators.findOne(indicatorId)
        const params = {
          _id: item._id,
          ...item.data,
          [indicatorParamName]: indicatorItemId
        }

        valueToCheck = await indicator.result({filterOptions: params, params, userId})
      } catch (err) {
        console.log(`Error in delete multiple items hook, indicator error`, err)
        return throwHookError(err)
      }
    } else {
      valueToCheck = value
    }
    valueToCheck = parseValueType(valueType, valueToCheck)

    let db
    let items = []
    try {
      const collection = await Collections.findOne(targetCollectionId)
      db = await collection.db()
      items = await db.find({[`data.${targetField}`]: valueToCheck}).toArray()

      const separation = !spacer ? '' : spacer
      let concatenatedValues = ''
      items.forEach((item, index) => {
        if (index !== 0) {
          if (!useSeparation) {
            concatenatedValues = concatenatedValues + separation + item.data[sourceField]
          } else {
            concatenatedValues =
              concatenatedValues + ' ' + separation + ' ' + item.data[sourceField]
          }
        } else {
          concatenatedValues = item.data[sourceField]
        }
      })

      await item.update({$set: {[`data.${saveToField}`]: concatenatedValues}})
      const newItem = await getItemFromCollection({collectionId, itemId: item._id})
      return {start: item, result: newItem, success: true}
    } catch (err) {
      console.log(
        `Error concatenating items with the hook ${hook.name} in environment ${environmentId}`
      )
      return throwHookError(err)
    }
  }
}
