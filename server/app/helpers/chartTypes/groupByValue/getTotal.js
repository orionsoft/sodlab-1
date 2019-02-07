export default function(operators, field) {
  if (field === '_id') {
    return operators.map(operator => ({[operator]: '$_id'}))
  }

  return operators.map(operator => ({[operator]: `$data.${field}`}))
}
