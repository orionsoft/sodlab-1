import XLSX from 'xlsx'

export const destruct = function(keys, obj) {
  return keys.reduce((a, c) => ({...a, [c]: obj[c]}), {})
}

export default function(items, footerItems, {title, fields}) {
  const tableFields = fields.map(field => {
    return field.fieldName
  })
  const data = items.map(item => {
    const dataFields = destruct(tableFields, item.data)
    return {
      _id: item._id,
      ...dataFields
    }
  })

  data.push({_id: ''})

  let dataSheet = XLSX.utils.json_to_sheet(data)
  if (footerItems && footerItems.length) {
    XLSX.utils.sheet_add_json(dataSheet, footerItems, {
      skipHeader: true,
      origin: {r: -1, c: 1}
    })
  }
  let book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, dataSheet, title || 'Data')

  return book
}
