export default {
  name: 'Fecha: Obtener valores de fecha actual',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    operation: {
      type: String,
      label: 'Operación',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Día de la semana', value: 'dayText'},
          {label: 'Nº día de la semana', value: 'dayNumberWeekend'},
          {label: 'Nº día del mes', value: 'dayNumber'},
          {label: 'Mes', value: 'monthText'},
          {label: 'Año', value: 'yearText'},
          {label: 'Nº del mes', value: 'monthNumber'},
          {label: 'Semana - Fin de semana', value: 'weekend'},
          {label: 'Semestre', value: 'semester'},
          {label: 'Trimestre', value: 'trimester'}
        ]
      }
    }
  },
  getRenderType: () => 'text',
  async getResult({options, params}) {
    const days = ['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM']
    const months = [
      'ENE',
      'FEB',
      'MAR',
      'ABR',
      'MAY',
      'JUN',
      'JUL',
      'AGO',
      'SEP',
      'OCT',
      'NOV',
      'DIC'
    ]

    const date = new Date()
    switch (options.operation) {
      case 'dayText':
        return days[date.getDay() - 1]
        break
      case 'dayNumberWeekend':
        return date.getDay()
        break
      case 'dayNumber':
        return date.getDate()
        break
      case 'monthText':
        return months[date.getMonth()]
        break
      case 'yearText':
        return date.getFullYear()
        break
      case 'monthNumber':
        return date.getMonth() + 1
        break
      case 'weekend':
        if (date.getDay() - 1 < 5) {
          return 'LUN - VIE'
        } else {
          return 'SAB - DOM'
        }
        break
      case 'semester':
        return Math.floor((date.getMonth() + 6) / 6)
        break
      case 'trimester':
        return Math.floor((date.getMonth() + 3) / 3)
    }
  }
}
