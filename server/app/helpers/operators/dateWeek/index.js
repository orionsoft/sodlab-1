import moment from 'moment'
export default {
  name: 'Semana actual',
  inputType: 'date',
  async resolve() {
    const date = new Date()
    const firstDay = moment(date).startOf('week')
    const endDay = moment(date).endOf('week')

    return {
      $gte: new Date(firstDay),
      $lt: new Date(endDay)
    }
  }
}
