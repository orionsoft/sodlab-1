export default {
  name: 'Existe',
  inputType: 'checkbox',
  async resolve(value) {
    return {$exists: value}
  }
}
