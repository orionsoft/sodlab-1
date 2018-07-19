export default {
  name: 'Suma',
  requireCollection: true,
  requireField: true,
  optionsSchema: null,
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
