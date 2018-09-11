import Collections from 'app/collections/Collections'
import numeral from 'numeral'

export default {
  name: 'Formatear número a miles',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    number: {
      type: String,
      label: 'Número a transformar en miles'
    }
  },
  getRenderType: async ({collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    return field.type
  },
  async getResult({options: {number}}) {
    return numeral(number).format('0,0.[00]')
  }
}
