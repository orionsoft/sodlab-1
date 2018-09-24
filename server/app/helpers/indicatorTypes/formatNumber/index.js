import Collections from 'app/collections/Collections'
import numeral from 'numeral'

export default {
  name: 'Formatear número a miles',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    number: {
      type: String,
      label: 'Número a transformar en miles'
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {number}}) {
    return numeral(number).format('0,0.[00]')
  }
}
