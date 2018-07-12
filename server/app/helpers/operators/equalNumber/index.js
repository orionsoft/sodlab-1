export default {
  name: 'Numero igual a',
  inputType: 'number',
  async resolve(value) {
    return {$eq: value}
  }
}
