import moment from 'moment'

export default {
  name: 'N días hacia atrás',
  inputType: 'number',
  async resolve(days) {
    const substractDays = moment().subtract(days, 'days')
    console.log(new Date(substractDays))
    return {
      $lte: new Date(substractDays)
    }
  }
}
