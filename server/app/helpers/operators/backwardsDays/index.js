import moment from 'moment'

export default {
  name: 'Histórico menos N días',
  inputType: 'number',
  async resolve(days) {
    const substractDays = moment()
      .subtract(days, 'days')
      .endOf('day')

    const startOfDay = moment(substractDays).startOf('day')

    return {
      $lt: new Date(startOfDay)
    }
  }
}
