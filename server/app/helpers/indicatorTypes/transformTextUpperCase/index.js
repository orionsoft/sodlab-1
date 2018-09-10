import Collections from 'app/collections/Collections'

export default {
  name: 'Transformar texto a mayúscula',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    itemId: {
      type: String,
      label: 'Item id'
    }
  },
  getRenderType: async ({collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    return field.type
  },
  async getResult({options, collection, fieldName, params}) {
    const item = await collection.findOne({_id: params._id})
    return item.data[fieldName].toUpperCase()
  }
}
