import escape from 'escape-string-regexp'

export default {
  name: 'No contiene',
  inputType: 'string',
  async resolve(value) {
    return {$regex: new RegExp(`^((?!${escape(value)}).)*$`), $options: '$i'}
  }
}
