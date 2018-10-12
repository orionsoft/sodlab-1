import moment from 'moment'
export default {
  name: 'Año actual',
  inputType: 'date',
  async resolve() {
    const date = new Date()
    const firstDay = moment(date).startOf('year')
    const endDay = moment(date).endOf('year')
    return {
      $gte: new Date(firstDay),
      $lt: new Date(endDay)
    }
  }
}
