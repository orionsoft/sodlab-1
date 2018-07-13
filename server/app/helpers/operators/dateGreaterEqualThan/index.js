export default {
  name: 'Fecha mayor o igual a',
  inputType: 'date',
  async resolve(value) {
    let date = new Date(value)
    return {$gte: date}
  }
}
