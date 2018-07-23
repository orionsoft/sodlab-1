export default function(fields) {
  if (!fields) return []
  const schema = fields.map(field => {
    return {
      fieldName: field.name || field.fieldName,
      optional: field.optional,
      editableLabel: field.label || field.editableLabel
    }
  })

  return schema
}
