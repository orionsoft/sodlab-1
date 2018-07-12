export default {
  name: 'Numero mayor o igual a',
  inputType: 'number',
  async resolve(value) {
    return {$gte: value}
  }
}
