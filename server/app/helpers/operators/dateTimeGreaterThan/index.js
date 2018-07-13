export default {
  name: 'Fecha con hora mayor a',
  inputType: 'datetime',
  async resolve(value) {
    let date = new Date(value)
    return {$gt: date}
  }
}
