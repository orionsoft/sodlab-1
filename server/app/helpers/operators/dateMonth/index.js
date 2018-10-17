import moment from 'moment'
export default {
  name: 'Mes Actual',
  inputType: 'date',
  async resolve() {
    const date = new Date()
    const firstDay = moment(date).startOf('month')
    const endDay = moment(date).endOf('month')

    return {
      $gte: new Date(firstDay),
      $lt: new Date(endDay)
    }
  }
}
