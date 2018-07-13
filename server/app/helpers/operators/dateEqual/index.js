export default {
  name: 'Fecha igual a',
  inputType: 'date',
  async resolve(value) {
    let date = new Date(value)
    // let lastDate = new Date(value)
    // firstDate.setHours(0, 0, 0, 0)
    // lastDate.setHours(23, 59, 59, 999)
    return {$eq: date}
  }
}
