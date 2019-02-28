import numeral from 'numeral'

export default {
  name: 'Formatear: Número a miles',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    number: {
      type: String,
      label: 'Nombre del parámetro que contiene el número a formatear'
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {number}}) {
    return numeral(number).format('0,0.[00]')
  }
}
