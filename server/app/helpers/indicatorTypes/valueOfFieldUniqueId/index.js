import Collections from 'app/collections/Collections'

export default {
  name: 'Valor: De un campo en un item (Query con único documento)',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    format: {
      type: String,
      label:
        'Formato a mostrar. Aplica sólo cuando el valor es de tipo fecha/fecha con hora. Ver opciones disponibles en https://momentjs.com/docs/#/displaying/format/'
    }
  },
  getRenderType: async ({collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    if (!field) return 'string'
    return field.type
  },
  getRenderFormat: async ({options, collectionId, fieldName}) => {
    const collection = await Collections.findOne(collectionId)
    const field = await collection.field({name: fieldName})
    if (!field) return 'string'
    const type = field.type
    if (type === 'date' || type === 'datetime') {
      if (!options.format.type) {
        return type === 'datetime' ? 'DD/MM/YYYY kk:mm' : 'DD/MM/YYYY'
      }
      return options.format.fixed.value
    }
    return type
  },
  async getResult({options, collection, query, fieldName}) {
    const [count] = await collection
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
    if (count.total === 1) {
      const item = await collection.findOne(query)
      if (fieldName === '_id') {
        return item._id
      }
      return item.data[fieldName]
    }
    console.log(
      'Error running valueOfFieldUniqueId indicator: Query delivered more than one document'
    )
    return null
  }
}
