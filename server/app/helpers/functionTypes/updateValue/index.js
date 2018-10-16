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
    useParam: {
      type: Boolean,
      label: 'Usar Parámetro',
      fieldType: 'checkbox'
    }
  },
  async execute({options}) {
    const {collectionId, valueKey, itemId, value, useParam} = options
    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)
    if (!item) return

    const newValue = useParam ? value : item.data[value]

    await item.update({$set: {[`data.${valueKey}`]: newValue}})
  }
}
