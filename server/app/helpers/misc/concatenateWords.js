/**
 * Receieves an array like ["foo", "bar", "biz"] and returns it like "foo, bar y biz"
 *
 * @param   {Array}  words  An array of strings (it may contain undefined values)
 * @returns {String}
 */
export default function(words) {
  const filteredWords = words.filter(label => typeof label !== 'undefined')
  const parsedWords = filteredWords.map((word, index, arr) => {
    if (index === 0) {
      return word
    } else if (index === arr.length - 1) {
      return ' y ' + word
    } else if (index > 0 && index <= arr.length - 2) {
      return ', ' + word
    }
  })

  let result = ''
  for (const word of parsedWords) {
    result += word
  }
  return result
}
