import escape from 'escape-string-regexp'

export default (template = '', itemCompleteData = [], item = {}) => {
  let content = template
  itemCompleteData.forEach(variable => {
    const regexp = new RegExp(`{${escape(variable)}}`, 'g')

    if (variable === '_id') {
      content = content.replace(regexp, item._id)
    } else {
      content = content.replace(regexp, item.data[variable])
    }
  })
  return content
}
