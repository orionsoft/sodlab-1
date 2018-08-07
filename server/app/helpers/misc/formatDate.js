export default function formatCurrentDate(date) {
  const newDate = date ? new Date(date) : new Date()
  var month = newDate.getMonth() + 1
  month = month < 10 ? '0' + month : month
  var day = newDate.getDate()
  day = day < 10 ? '0' + day : day
  return newDate.getFullYear() + '-' + month + '-' + day
}
