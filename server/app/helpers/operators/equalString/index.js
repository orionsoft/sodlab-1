export default {
  name: 'Igual a',
  inputType: 'string',
  async resolve(value) {
    return {$eq: value}
  }
}
