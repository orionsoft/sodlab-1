export default {
  name: 'Fecha menor a',
  inputType: 'date',
  async resolve(value) {
    let date = new Date(value)
    return {$lt: date}
  }
}
