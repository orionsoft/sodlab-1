import XLSX from 'xlsx'
import renderValues from './renderValues'

export const destruct = function(keys, obj) {
  return keys.filter(c => c).reduce((a, c) => ({...a, [c]: obj[c]}), {})
}

export default async function(
  items,
  footerItems,
  {_id, exportWithId, title, fields},
  collectionFields
) {
  const tableFields = fields.map(field => {
    return field.fieldName
  })
  const colFields = collectionFields.filter(field => {
    return tableFields.includes(field.name)
  })
  const data = await Promise.all(
    items.map(async item => {
      const dataFields = destruct(tableFields, item.data)
      const renderedFields = await renderValues(_id, dataFields, colFields)
      return {
        ...(exportWithId && {_id: item._id}),
        ...renderedFields
      }
    })
  )

  data.push({})

  let dataSheet = XLSX.utils.json_to_sheet(data)
  if (footerItems && footerItems.length) {
    XLSX.utils.sheet_add_json(dataSheet, footerItems, {
      skipHeader: true,
      origin: {r: -1, c: exportWithId ? 1 : 0}
    })
  }
  let book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, dataSheet, title || 'Data')

  return book
}
