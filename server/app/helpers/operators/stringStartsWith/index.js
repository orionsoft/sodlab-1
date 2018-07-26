import escape from 'escape-string-regexp'

export default {
  name: 'Empieza con',
  inputType: 'string',
  async resolve(value) {
    return {$regex: new RegExp(`^${escape(value)}+`)}
  }
}
