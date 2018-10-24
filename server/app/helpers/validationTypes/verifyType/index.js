import Collections from 'app/collections/Collections'

export default {
  name: 'Verifica tipo archivo',
  optionsSchema: {
    collectionId: {
      type: String,
      label: 'Colección donde buscar',
      fieldType: 'collectionSelect'
    },
    valueKey: {
      type: String,
      label: 'Campo sobre el cual buscar',
      fieldType: 'collectionFieldSelect'
    },
    files: {
      type: [String],
      label: 'Tipo de archivo a validar',
      fieldType: 'multipleSelect',
      fixed: true,
      fieldOptions: {
        options: [
          {label: 'Pdf', value: 'application/pdf'},
          {label: 'Png', value: 'image/png'},
          {label: 'Jpg', value: 'image/jpeg'},
          {
            label: 'Excel',
            value: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          },
          {
            label: 'Word',
            value: 'application/vnd.oasis.opendocument.text'
          }
        ]
      }
    }
  },
  async execute({options: {collectionId, valueKey, files}}) {
    const collection = await Collections.findOne(collectionId)
    const collectionDb = await collection.db()
    const {data} = await collectionDb.findOne({_id: 'J3rkvNJaAtwpBBJFo'})
    const filterType = files.filter(file => file === data[valueKey].type)
    if (filterType.length > 0) {
      return null
    } else {
      throw new Error('Tipo de archivo inválido')
    }
  }
}
