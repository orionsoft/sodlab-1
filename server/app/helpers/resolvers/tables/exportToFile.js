import XLSX from 'xlsx'

export default function(items, footerItems, tableTitle) {
  const data = items.map(item => {
    return {
      _id: item._id,
      ...item.data
    }
  })

  data.push({_id: ''})

  let dataSheet = XLSX.utils.json_to_sheet(data)
  if (footerItems && footerItems.length) {
    XLSX.utils.sheet_add_json(dataSheet, footerItems, {
      skipHeader: true,
      origin: -1
    })
  }
  let book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, dataSheet, tableTitle || 'Data')

  return book
}
