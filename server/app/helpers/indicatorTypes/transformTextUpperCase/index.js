import Collections from 'app/collections/Collections'

export default {
  name: 'Transformar texto a mayúscula',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    text: {
      type: String,
      label: 'Texto a transformar a mayúsculas'
    }
  },
  getRenderType: async ({collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    return field.type
  },
  async getResult({options: {text}}) {
    return text.toUpperCase()
  }
}
