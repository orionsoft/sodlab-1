export default {
  name: 'Fecha con hora menor a',
  inputType: 'datetime',
  async resolve(value) {
    let date = new Date(value)
    return {$lt: date}
  }
}
