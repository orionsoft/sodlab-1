import moment from 'moment'
export default {
  name: 'Mes del día seleccionado',
  inputType: 'date',
  async resolve(value) {
    const date = new Date(value)
    const firstDay = moment(date).startOf('month')
    const endDay = moment(date).endOf('month')

    return {
      $gte: new Date(firstDay),
      $lt: new Date(endDay)
    }
  }
}
