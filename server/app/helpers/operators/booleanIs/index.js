export default {
  name: 'El valor es',
  inputType: 'boolean',
  async resolve(value) {
    return value || {$ne: true}
  }
}
