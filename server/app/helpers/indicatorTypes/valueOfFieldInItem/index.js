export default {
  name: 'Valor de un campo en un item',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    itemId: {
      type: String,
      label: 'Item id'
    }
  },
  getRenderType: () => 'string',
  async getResult({options, collection, fieldName, query}) {
    const item = await collection.findOne({_id: options.itemId})
    if (!item) return null
    return item.data[fieldName]
  }
}
