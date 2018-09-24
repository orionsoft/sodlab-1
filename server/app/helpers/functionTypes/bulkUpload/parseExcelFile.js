import xlsx from 'xlsx'

export default function(buffer) {
  const workbook = xlsx.read(buffer, {type: 'buffer'})
  const firstSheet = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheet]
  const object = xlsx.utils.sheet_to_json(worksheet, {})
  return object
}
