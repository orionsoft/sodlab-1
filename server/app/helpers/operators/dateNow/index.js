import moment from 'moment'
export default {
  name: 'Día actual',
  inputType: 'date',
  async resolve() {
    const start = moment().startOf('day')
    const end = moment().endOf('day')

    return {
      $gte: new Date(start),
      $lt: new Date(end)
    }
  }
}
