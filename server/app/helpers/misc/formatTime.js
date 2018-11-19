export default function formatCurrentTime(date) {
  const newDate = date ? new Date(date) : new Date()
  let hours = newDate.getHours()
  hours = hours < 10 ? '0' + hours : hours
  let minutes = newDate.getMinutes()
  minutes = minutes < 10 ? '0' + minutes : minutes
  let seconds = newDate.getSeconds()
  seconds = seconds < 10 ? '0' + seconds : seconds
  let miliseconds = newDate.getMilliseconds()
  return hours + ':' + minutes + ':' + seconds + ':' + miliseconds
}
