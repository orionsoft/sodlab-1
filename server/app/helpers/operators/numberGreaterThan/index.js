export default {
  name: 'Numero mayor a',
  inputType: 'number',
  async resolve(value) {
    return {$gt: value}
  }
}
