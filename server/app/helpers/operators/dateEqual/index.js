export default {
  name: 'Fecha igual a',
  inputType: 'date',
  async resolve(value) {
    let firstDate = new Date(value)
    let lastDate = new Date(value)
    firstDate.setHours(0, 0, 0, 0)
    lastDate.setHours(23, 59, 59, 999)
    return {$gte: firstDate, $lte: lastDate}
  }
}
