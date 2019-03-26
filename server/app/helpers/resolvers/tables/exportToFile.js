import XLSX from 'xlsx'
import formatValues from './formatValues'

export default async function(
  items,
  footerItems,
  {_id, exportWithId, title, fields},
  collectionFields
) {
  const tableFields = fields
    .filter(field => {
      return field.type === 'field'
    })
    .map(field => {
      return {fieldName: field.fieldName, label: field.label}
    })
  const data = await Promise.all(
    items.map(async item => {
      const renderedFields = await formatValues(_id, item.data, collectionFields, tableFields)
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
