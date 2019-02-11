export default function(operators, field) {
  if (operators.includes('$count')) {
    return [{count: {$sum: 1}}]
  }
  if (field === '_id') {
    return operators.map(operator => ({[operator]: '$_id'}))
  }

  return operators.map(operator => ({[operator]: `$data.${field}`}))
}
