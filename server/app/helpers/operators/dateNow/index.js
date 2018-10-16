import moment from 'moment'
export default {
  name: 'Día actual',
  inputType: 'date',
  async resolve() {
    const startOfDay = moment().startOf('day')
    const endOfDay = moment().endOf('day')

    return {
      $gte: new Date(startOfDay),
      $lt: new Date(endOfDay)
    }
  }
}
