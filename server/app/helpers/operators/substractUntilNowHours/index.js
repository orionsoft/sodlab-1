import moment from 'moment'

export default {
  name: 'Últimas N horas',
  inputType: 'number',
  async resolve(hours) {
    const substractHours = moment().subtract(hours * 2, 'hours')

    return {
      $gte: new Date(substractHours),
      $lt: new Date()
    }
  }
}
