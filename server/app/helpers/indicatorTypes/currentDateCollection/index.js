import Collections from 'app/collections/Collections'
export default {
  name: 'Fecha: Obtener valores de variable',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    date: {
      type: String,
      label: 'ItemId'
    },
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
          {label: 'Nº del mes', value: 'monthNumber'},
          {label: 'Año', value: 'yearText'},
          {label: 'Semana - Fin de semana', value: 'weekend'},
          {label: 'Semestre', value: 'semester'},
          {label: 'Trimestre', value: 'trimester'}
        ]
      }
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {date, operation}}) {
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

    const collectionDate = new Date(date)
    switch (operation) {
      case 'dayText':
        return days[collectionDate.getDay() - 1]
        break
      case 'dayNumberWeekend':
        return collectionDate.getDay()
        break
      case 'dayNumber':
        return collectionDate.getDate()
        break
      case 'monthText':
        return months[collectionDate.getMonth()]
        break
      case 'monthNumber':
        return collectionDate.getMonth() + 1
        break
      case 'yearText':
        return collectionDate.getFullYear()
        break
      case 'weekend':
        if (collectionDate.getDay() - 1 < 5) {
          return 'LUN - VIE'
        } else {
          return 'SAB - DOM'
        }
        break
      case 'semester':
        return Math.floor((collectionDate.getMonth() + 6) / 6)
        break
      case 'trimester':
        return Math.floor((collectionDate.getMonth() + 3) / 3)
        break
    }
  }
}
