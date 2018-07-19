export default {
  name: 'Cuenta',
  requireCollection: true,
  requireField: false,
  optionsSchema: null,
  async getResult({collection, query}) {
    const [result] = await collection
      .aggregate([
        {
          $match: query
        },
        {
          $group: {
            _id: null,
            total: {$sum: 1}
          }
        }
      ])
      .toArray()
    if (!result) return 0
    return result.total
  }
}
