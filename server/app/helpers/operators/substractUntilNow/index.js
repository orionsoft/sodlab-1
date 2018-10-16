import moment from 'moment'

export default {
  name: 'Últimos N días',
  inputType: 'number',
  async resolve(days) {
    const substractDays = moment().subtract(days, 'days')

    return {
      $gte: new Date(substractDays),
      $lt: new Date()
    }
  }
}
