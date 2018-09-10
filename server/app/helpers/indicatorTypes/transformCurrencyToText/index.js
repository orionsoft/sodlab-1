import Collections from 'app/collections/Collections'
import writtenNumber from 'written-number'

function formatter(num) {
  writtenNumber.defaults.lang = 'es'
  if (num.toString().endsWith('000000')) {
    return writtenNumber(num) + ' de pesos'
  } else {
    return writtenNumber(num) + ' pesos'
  }
}

export default {
  name: 'Transformar moneda a texto',
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
    return formatter(item.data[fieldName])
  }
}
