import {Files} from '@orion-js/file-manager'

export default {
  name: 'Verifica tipo archivo',
  optionsSchema: {
    collectionId: {
      type: String,
      label: 'Colección donde buscar',
      fieldType: 'collectionSelect'
    },
    value: {
      type: String,
      label: 'Params'
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
  async execute({options: {files, value}}) {
    const {type} = await Files.findOne({_id: '6ji785KKLJ2u5FA7b'})

    const filterType = files.filter(file => file === type)
    if (filterType.length > 0) {
      return null
    } else {
      throw new Error('Tipo de archivo inválido')
    }
  }
}
