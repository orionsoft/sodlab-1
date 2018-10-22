export default {
  name: 'Valor: De un parámetro',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    params: {
      type: String,
      label: 'Nombre del parámetro'
    }
  },
  getRenderType: () => 'text',
  async getResult({options, collection, fieldName, params}) {
    return options.params
  }
}
