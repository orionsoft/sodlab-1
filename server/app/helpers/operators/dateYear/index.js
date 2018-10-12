import moment from 'moment'
export default {
  name: 'Año del día seleccionado',
  inputType: 'date',
  async resolve(value) {
    const date = new Date(value)
    const firstDay = moment(date).startOf('year')
    const endDay = moment(date).endOf('year')

    return {
      $gte: new Date(firstDay),
      $lt: new Date(endDay)
    }
  }
}
