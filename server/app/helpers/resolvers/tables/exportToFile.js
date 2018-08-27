import XLSX from 'xlsx'

export default async function(items, footerItems, tableTitle) {
  const data = await Promise.all(
    items.map(async item => {
      return await {
        _id: item._id,
        ...item.data
      }
    })
  )

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
