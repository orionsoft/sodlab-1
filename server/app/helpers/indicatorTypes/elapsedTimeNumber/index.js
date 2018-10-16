import moment from 'moment'

export default {
  name: 'Tiempo: Transcurrido en número',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    itemId: {
      type: String,
      label: 'Item Id'
    },
    operation: {
      type: String,
      label: 'Operación',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Segundos', value: 'seconds'},
          {label: 'Minutos', value: 'minutes'},
          {label: 'Horas', value: 'hours'},
          {label: 'Días', value: 'days'},
          {label: 'Semanas', value: 'weekends'},
          {label: 'Meses', value: 'months'}
        ]
      }
    }
  },
  getRenderType: () => 'text',
  async getResult({collection, fieldName, options: {itemId, operation}}) {
    const [document] = await collection.find({_id: itemId}).toArray()
    const now = moment(new Date())
    const end = moment(new Date(document.data[fieldName]))
    const duration = moment.duration(now.diff(end))
    switch (operation) {
      case 'seconds':
        return Math.round(duration.asSeconds())
        break
      case 'minutes':
        return Math.round(duration.asMinutes())
        break
      case 'hours':
        return Math.round(duration.asHours())
        break
      case 'days':
        return Math.round(duration.asDays())
        break
      case 'weekends':
        return Math.round(duration.asWeeks())
        break
      case 'months':
        return Math.round(duration.asMonths())
        break
    }
  }
}
