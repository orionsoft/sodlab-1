import Collections from 'app/collections/Collections'

export default {
  name: 'Actualizar valor',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    valueKey: {
      type: String,
      label: 'Campo a actualizar',
      fieldType: 'collectionFieldSelect'
    },
    itemId: {
      type: String,
      label: 'Id del item'
    },
    value: {
      type: String,
      label: 'Valor a insertar',
      fieldType: 'collectionFieldSelect'
    },
    fieldValue: {
      type: String,
      label: 'Valor del campo a insertar',
      fieldType: 'fieldOptions',
      parentCollection: 'collectionId',
      parentField: 'value',
      optional: true
    },
    useParam: {
      type: Boolean,
      label: 'Usar Parámetro',
      fieldType: 'checkbox',
      optional: true
    }
  },
  async execute({options}) {
    const {collectionId, valueKey, itemId, value, fieldValue, useParam} = options

    try {
      const col = await Collections.findOne(collectionId)
      const collection = await col.db()
      const item = await collection.findOne(itemId)

      if (!item) return

      const newValue = useParam ? value : fieldValue ? fieldValue : item.data[value]

      await item.update({$set: {[`data.${valueKey}`]: newValue}})
    } catch (err) {
      const newValue = useParam ? value : fieldValue ? fieldValue : `item.data.${value}`
      console.log(
        `Error when trying to update the docId: ${itemId} from collection ${collectionId}, from value: ${value} to new value: ${newValue}`,
        err
      )
    }
  }
}
