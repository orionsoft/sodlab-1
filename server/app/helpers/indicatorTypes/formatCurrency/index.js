import Collections from 'app/collections/Collections'
import numeral from 'numeral'

export default {
  name: 'Formatear moneda a pesos',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    currency: {
      type: String,
      label: 'Moneda a transformar en pesos'
    }
  },
  getRenderType: async ({collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    return field.type
  },
  async getResult({options: {currency}}) {
    return numeral(currency).format('$0,0.[00]')
  }
}
