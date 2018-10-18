import moment from 'moment'
export default {
  name: 'Semana actual',
  inputType: 'date',
  async resolve() {
    const date = new Date()
    const firstDay = moment(date).startOf('isoWeek')
    const endDay = moment(date).endOf('isoWeek')

    return {
      $gte: new Date(firstDay),
      $lt: new Date(endDay)
    }
  }
}
