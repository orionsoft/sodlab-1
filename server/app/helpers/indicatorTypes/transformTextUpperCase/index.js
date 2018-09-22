import Collections from 'app/collections/Collections'

export default {
  name: 'Transformar texto a mayúscula',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    text: {
      type: String,
      label: 'Texto a transformar a mayúsculas'
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {text}}) {
    return text.toUpperCase()
  }
}
