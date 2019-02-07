export default function(fields) {
  let group = {}
  for (const field of fields) {
    if (field === '_id') {
      group[field] = `$${field}`
    } else {
      group[field] = `$data.${field}`
    }
  }
  return group
}
