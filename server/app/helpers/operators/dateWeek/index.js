import moment from 'moment'
export default {
  name: 'Semana del día seleccionado',
  inputType: 'date',
  async resolve(value) {
    const date = new Date(value)
    const firstDay = moment(date).startOf('week')
    const endDay = moment(date).endOf('week')

    return {
      $gte: new Date(firstDay),
      $lt: new Date(endDay)
    }
  }
}
