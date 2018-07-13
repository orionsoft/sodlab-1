export default {
  name: 'Fecha igual a',
  inputType: 'date',
  async resolve(value) {
    let date = new Date(value)
    return {$eq: date}
  }
}
