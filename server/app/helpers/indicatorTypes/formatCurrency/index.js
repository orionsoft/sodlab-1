import numeral from 'numeral'

export default {
  name: 'Formatear: Moneda a pesos',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    currency: {
      type: String,
      label: 'Nombre del parámetro que contiene el número a formatear'
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {currency}}) {
    return numeral(currency).format('$0,0.[00]')
  }
}
