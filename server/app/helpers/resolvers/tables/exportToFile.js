import XLSX from 'xlsx'

export default async function(items, footerItems) {
  const data = Promise.all(
    items.map(async item => {
      return await {
        _id: item._id,
        ...item.data
      }
    })
  )

  let footerArray = [].concat(...footerItems)
  let footerData = Object.assign(...footerArray)

  let dataSheet = XLSX.utils.json_to_sheet(await data)
  let footerSheet = XLSX.utils.json_to_sheet([footerData])

  let book = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(book, dataSheet, 'Data')
  XLSX.utils.book_append_sheet(book, footerSheet, 'Footer')

  return book
}
