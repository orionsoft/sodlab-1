import Collections from 'app/collections/Collections'
import numeral from 'numeral'

export default {
  name: 'Formatear número a miles',
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
    const item = await collection.findOne({_id: options.itemId})
    if (!item) return null
    return numeral(item.data[fieldName]).format('$0,0.[00]')
  }
}
