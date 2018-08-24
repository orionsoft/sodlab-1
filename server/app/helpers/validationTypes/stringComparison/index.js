import escape from 'escape-string-regexp'

export default {
  name: 'Comparación de números',
  optionsSchema: {
    value: {
      type: String,
      label: 'Valor'
    },
    type: {
      type: String,
      label: 'Tipo de validación',
      fieldType: 'select',
      fixed: true,
      fieldOptions: {
        options: [
          {label: 'Contiene', value: 'contains'},
          {label: 'No Contiene', value: 'notContains'},
          {label: 'Empieza con', value: 'startsWith'},
          {label: 'No empieza con', value: 'notStartsWith'},
          {label: 'Igual a', value: 'equalsTo'},
          {label: 'Distinto a', value: 'notEqualsTo'},
          {label: 'Termina con', value: 'endsWith'},
          {label: 'No termina con', value: 'notEndsWith'}
        ]
      }
    },
    comparingValue: {
      type: Number,
      label: 'Valor de comparación'
    },
    caseSensitive: {
      type: Boolean,
      label: 'Distinguir mayúsculas de minúsculas'
    }
  },
  async execute({options: {value, type, comparingValue, caseSensitive}}) {
    const options = caseSensitive ? '' : 'i'
    if (type === 'contains') {
      const regex = new RegExp(escape(comparingValue), options)
      if (!regex.test(value)) {
        throw new Error('El valor debe contener ' + comparingValue)
      }
    } else if (type === 'notContains') {
      const regex = new RegExp(escape(comparingValue), options)
      if (regex.test(value)) {
        throw new Error('El valor no debe contener ' + comparingValue)
      }
    } else if (type === 'startsWith') {
      const regex = new RegExp('^' + escape(comparingValue), options)
      if (!regex.test(value)) {
        throw new Error('El valor debe empezar con ' + comparingValue)
      }
    } else if (type === 'notStartsWith') {
      const regex = new RegExp('^' + escape(comparingValue), options)
      if (regex.test(value)) {
        throw new Error('El valor no debe empezar con ' + comparingValue)
      }
    } else if (type === 'equalsTo') {
      const regex = new RegExp('^' + escape(comparingValue) + '$', options)
      if (!regex.test(value)) {
        throw new Error('El valor debe ser igual a ' + comparingValue)
      }
    } else if (type === 'notEqualsTo') {
      const regex = new RegExp('^' + escape(comparingValue) + '$', options)
      if (regex.test(value)) {
        throw new Error('El valor debe ser distinto a ' + comparingValue)
      }
    } else if (type === 'endsWith') {
      const regex = new RegExp(escape(comparingValue) + '$', options)
      if (!regex.test(value)) {
        throw new Error('El valor debe terminar con ' + comparingValue)
      }
    } else if (type === 'notEndsWith') {
      const regex = new RegExp(escape(comparingValue) + '$', options)
      if (regex.test(value)) {
        throw new Error('El valor no debe terminar con ' + comparingValue)
      }
    }
  }
}
