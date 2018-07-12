export default {
  name: 'Numero menor o igual a',
  inputType: 'number',
  async resolve(value) {
    return {$lte: value}
  }
}
