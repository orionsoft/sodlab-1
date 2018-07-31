export default {
  name: 'No contiene',
  inputType: 'string',
  async resolve(value) {
    return {$regex: `^((?!${value}).)*$`, $options: '$i'}
  }
}
