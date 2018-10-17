import Collections from 'app/collections/Collections'
export default {
  name: 'Operación: Suma',
  requireCollection: true,
  requireField: true,
  optionsSchema: null,
  getRenderType: async ({options, params, collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    return field.type
  },
  async getResult({collection, fieldName, query}) {
    const [result] = await collection
      .aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: null,
            total: {$sum: `$data.${fieldName}`}
          }
        }
      ])
      .toArray()
    if (!result) return 0
    return result.total
  }
}
