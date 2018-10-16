import moment from 'moment'

export default {
  name: 'Histórico menos N días',
  inputType: 'number',
  async resolve(days) {
    const substractDays = moment().subtract(days, 'days')

    return {
      $lte: new Date(substractDays)
    }
  }
}
