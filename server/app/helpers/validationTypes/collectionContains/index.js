import Collections from 'app/collections/Collections'
export default {
  name: 'Existe en colección',
  optionsSchema: {
    collectionId: {
      type: String,
      label: 'Colección donde buscar',
      fixed: true,
      fieldType: 'collectionSelect'
    },
    valueKey: {
      type: String,
      label: 'Campo sobre el cual buscar',
      fixed: true,
      fieldType: 'collectionFieldSelect'
    },
    value: {
      type: String,
      label: 'Valor a buscar'
    },
    message: {
      type: String,
      label: 'Mensaje a mostrar'
    }
  },
  async execute({options: {collectionId, valueKey, value, message}}) {
    const collection = await Collections.findOne(collectionId)
    const collectionDb = await collection.db()
    let valueFound
    if (valueKey === '_id') {
      valueFound = await collectionDb.findOne(value)
    } else {
      valueFound = await collectionDb.findOne({[`data.${valueKey}`]: value})
    }
    if (valueFound) {
      throw new Error(message)
    }
  }
}
