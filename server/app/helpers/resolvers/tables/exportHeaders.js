import XLSX from 'xlsx'

export default async function(fields) {
  let fieldObject = {}
  fields.forEach(field => {
    fieldObject[field.name] = null
  })

  let headersSheet = XLSX.utils.json_to_sheet([fieldObject])

  let book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, headersSheet, 'Data')

  return book
}
