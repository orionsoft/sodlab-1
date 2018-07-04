export default {
  name: 'Existe',
  inputType: 'boolean',
  async resolve(value) {
    return {$exists: value}
  }
}
