import moment from 'moment'

export default {
  name: 'Histórico menos N horas',
  inputType: 'number',
  async resolve(hours) {
    const substractHours = moment().subtract(hours, 'hours')
    return {
      $lte: new Date(substractHours)
    }
  }
}
