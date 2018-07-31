export default {
  name: 'Distinto a',
  inputType: 'string',
  async resolve(value) {
    return {$ne: value}
  }
}
