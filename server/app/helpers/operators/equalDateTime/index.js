export default {
  name: 'Fecha con hora igual a',
  inputType: 'datetime',
  async resolve(value) {
    let date = new Date(value)
    return {$eq: date}
  }
}
