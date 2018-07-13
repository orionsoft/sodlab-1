export default {
  name: 'Fecha con hora mayor o igual a',
  inputType: 'datetime',
  async resolve(value) {
    let date = new Date(value)
    return {$gte: date}
  }
}
