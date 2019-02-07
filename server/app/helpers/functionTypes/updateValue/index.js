import {getItemFromCollection, hookStart, parseValueType, throwHookError} from '../helpers'

export default {
  name: 'Actualizar valor',
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
    valueKey: {
      type: String,
      label: 'Campo a actualizar',
      fieldType: 'collectionFieldSelect'
    },
    value: {
      type: String,
      label: 'Valor a insertar',
      fieldType: 'collectionFieldSelect'
    },
    fieldValue: {
      type: String,
      label: '(opcional) Valor del campo a insertar',
      fieldType: 'fieldOptions',
      parentCollection: 'collectionId',
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
      defaultValue: 'string'
    }
  },
  async execute({options, hook, hooksData, viewer}) {
    const {collectionId, valueKey, itemId, value, fieldValue, useParam, valueType} = options
    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
      const newValue = useParam ? value : fieldValue ? fieldValue : item.data[value]
      const formattedValue = parseValueType(valueType, newValue)

      await item.update({$set: {[`data.${valueKey}`]: formattedValue}})

      const newItem = await getItemFromCollection({collectionId, itemId: item._id})
      return {start: item, result: newItem, success: true}
    } catch (err) {
      if (typeof item !== 'undefined') {
        const newValue = useParam ? value : fieldValue ? fieldValue : `${item.data[value]}`
        console.log(
          `Error when trying to update the docId: ${
            item._id
          } from collection ${collectionId}, from value: ${value} to new value: ${newValue}`,
          err
        )
      }
      return throwHookError(err)
    }
  }
}
