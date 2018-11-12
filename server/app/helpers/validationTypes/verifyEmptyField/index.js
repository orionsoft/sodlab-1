import {isUndefined, isNull} from 'lodash'

export default {
  name: 'Verifica valor vacío para campos condicionales',
  optionsSchema: {
    value: {
      type: String,
      label: 'Campo a validar (parámetro)',
      optional: true
    },
    type: {
      type: String,
      label: 'Tipo de validación en el CheckBox',
      fieldType: 'select',
      fixed: true,
      fieldOptions: {
        options: [
          {label: 'Mostrar igual a', value: 'equalsTo'},
          {label: 'Mostrar diferentes a', value: 'notEqualsTo'}
        ]
      }
    },
    fieldName: {
      type: String,
      label: 'Nombre del campo (parámetro)',
      optional: true
    },

    valueName: {
      type: String,
      label: 'Valor del campo (valor fijo)',
      optional: true
    },
    message: {
      type: String,
      label: 'Mensaje personalizado a mostrar'
    }
  },
  async execute({options: {value, message, type}, params: {fieldName, valueName}}) {
    if (type === 'equalsTo') {
      if (fieldName === valueName) {
        if (isNull(value)) {
          throw new Error(message)
        }

        if (isUndefined(value)) {
          throw new Error(message)
        }
      }
    }

    if (type === 'notEqualsTo') {
      if (fieldName !== valueName) {
        if (isNull(value)) {
          throw new Error(message)
        }

        if (isUndefined(value)) {
          throw new Error(message)
        }
      }
    }
  }
}
