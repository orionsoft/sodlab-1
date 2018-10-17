import moment from 'moment'

export default {
  name: 'Últimos N días',
  inputType: 'number',
  async resolve(days) {
    const substractDays = moment().subtract(days, 'days')
    const starOfDay = moment(substractDays).startOf('day')
    const endOfDay = moment().endOf('day')

    return {
      $gte: new Date(starOfDay),
      $lte: new Date(endOfDay)
    }
  }
}
