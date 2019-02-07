import Collections from 'app/collections/Collections'

export default async function(collectionId, xAxisTicks) {
  if (!collectionId) return []
  if (!xAxisTicks) return []

  const col = await Collections.findOne(collectionId)
  const field = col.fields.filter(field => field.name === xAxisTicks)

  if (!field) return []
  if (Array.isArray(field) && field[0].options) {
    const options = field[0].options
    const xAxisLabels = options.options.map(option => option.label || 'no value')
    return xAxisLabels
  }
  return [field.name]
}
