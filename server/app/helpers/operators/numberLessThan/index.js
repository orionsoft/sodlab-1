export default {
  name: 'Numero menor a',
  inputType: 'number',
  async resolve(value) {
    return {$lt: value}
  }
}
