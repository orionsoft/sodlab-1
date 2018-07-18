export default {
  name: 'Fecha con hora menor o igual a',
  inputType: 'datetime',
  async resolve(value) {
    let date = new Date(value)
    return {$lte: date}
  }
}
