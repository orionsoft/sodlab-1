import Collections from 'app/collections/Collections'
import numeral from 'numeral'

export default {
  name: 'Formatear: Moneda a pesos',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    currency: {
      type: String,
      label: 'Moneda a transformar en pesos'
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {currency}}) {
    return numeral(currency).format('$0,0.[00]')
  }
}
