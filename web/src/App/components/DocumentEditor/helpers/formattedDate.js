export default () => {
  const date = new Date()
  let month = date.getMonth() + 1
  let day = date.getDate()
  month = month.toString().length === 1 ? '0' + month : month
  day = day.toString().length === 1 ? '0' + day : day
  const hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds()
  const currentDate = `${date.getFullYear()}.${month}.${day}`
  const currentTime = `${hours}:${minutes}:${seconds}`
  return { currentDate, currentTime }
}
