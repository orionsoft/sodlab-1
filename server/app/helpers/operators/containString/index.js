export default {
  name: 'Contiene',
  inputType: 'string',
  async resolve(value) {
    return {$regex: `${value}`, $options: '$i'}
  }
}
