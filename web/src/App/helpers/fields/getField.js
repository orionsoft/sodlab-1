import fieldTypes from 'App/components/fieldTypes'

export default function(type) {
  const found = fieldTypes[type]
  if (!found) {
    throw new Error('No field type found for ' + type)
  }
  return found.field
}
