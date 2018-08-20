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
      label: 'Valor a insertar'
    }
  },
  async execute({options}) {
    const {collectionId, valueKey, itemId, value} = options
    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)
    if (!item) return

    await item.update({$set: {[`data.${valueKey}`]: value}})
  }
}
