export default {
  name: 'Fecha mayor a',
  inputType: 'date',
  async resolve(value) {
    let date = new Date(value)
    return {$gt: date}
  }
}
