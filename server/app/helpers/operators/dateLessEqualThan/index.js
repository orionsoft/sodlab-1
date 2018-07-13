export default {
  name: 'Fecha menor o igual a',
  inputType: 'date',
  async resolve(value) {
    let date = new Date(value)
    return {$lte: date}
  }
}
