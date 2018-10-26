export default {
  name: 'Validar CheckBox o Booleano',
  optionsSchema: {
    value: {
      type: String,
      label: 'Variable a validar'
    },
    message: {
      type: String,
      label: 'Mensaje'
    },
    checkbox: {
      type: String,
      label: 'Validar que variable sea',
      fieldType: 'select',
      fixed: true,
      fieldOptions: {
        options: [{label: 'Verdadero', value: true}, {label: 'Falso', value: false}]
      }
    }
  },
  async execute({options: {message, checkbox, value}}) {
    if (checkbox !== value) {
      throw new Error(message)
    } else {
      return null
    }
  }
}
