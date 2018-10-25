import {Files} from '@orion-js/file-manager'

export default {
  name: 'Verifica tipo archivo',
  optionsSchema: {
    value: {
      type: String,
      label: 'Parámetro (nombre de la variable en la colección)'
    },
    message: {
      type: String,
      label: 'Mensaje de validador'
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
            value: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          },
          {
            label: 'Power Point',
            value: 'application/vnd.ms-powerpoint'
          }
        ]
      }
    }
  },
  async execute({
    options: {files, message},
    params: {
      value: {_id}
    }
  }) {
    const {type} = await Files.findOne({_id})
    const filterType = files.find(file => file === type)
    if (filterType) {
      return null
    } else {
      const formatType = files.map(file => {
        switch (file) {
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return 'Word'
          case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            return 'Excel'
          case 'application/vnd.ms-powerpoint':
            return 'Power Point'
          case 'application/pdf':
            return 'PDF'
          case 'image/png':
            return 'PNG'
          case 'image/jpeg':
            return 'JPG'
        }
      })

      throw new Error(`${message} ${formatType.join(', ').toString()}`)
    }
  }
}
