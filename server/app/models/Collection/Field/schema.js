export default {
  name: {
    type: 'ID',
    label: 'ID',
    description: 'El id único del field en el collection, no cambiar nunca'
  },
  label: {
    type: String,
    label: 'El título del campo'
  },
  type: {
    type: String,
    allowedValues: ['string'],
    label: 'Tipo'
  },
  options: {
    type: 'blackbox',
    optional: true
  }
}
