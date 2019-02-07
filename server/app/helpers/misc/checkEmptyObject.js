export default function(obj) {
  const isEmpty = Object.keys(obj).length === 0 && obj.constructor === Object
  return isEmpty
}
