import Collections from 'app/collections/Collections'

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

export default {
  name: 'Transformar fecha a texto',
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

    return (
      item.data[fieldName].getDate() +
      ' de ' +
      months[item.data[fieldName].getMonth()] +
      ' de ' +
      item.data[fieldName].getFullYear()
    )
  }
}
