export default {
  name: 'El valor es',
  inputType: 'checkbox',
  async resolve(value) {
    return value || {$ne: true}
  }
}
