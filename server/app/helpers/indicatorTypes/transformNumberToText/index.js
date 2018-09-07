import Collections from 'app/collections/Collections'
import writtenNumer from 'written-number'

export default {
  name: 'Transformar número/moneda a texto',
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
  async getResult({options, collection, fieldName}) {
    const item = await collection.findOne({_id: options.itemId})
    if (!item) return null
    return writtenNumer(item.data[fieldName], {lang: 'es'}) + ' pesos'
  }
}
