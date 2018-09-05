import clean from './clean'
import numeral from 'numeral'

export default {
  name: 'RUT',
  rootType: String,
  allowedOperatorsIds: ['exists', 'equalString'],
  optionsSchema: {},
  validate(value, options) {
    if (!value) return
    let rut = value.toString()

    if (!/^0*(\d{1,3}(\.?\d{3})*)-?([\dkK])$/.test(rut)) {
      return 'invalid rut'
    }

    rut = clean(rut)

    var t = parseInt(rut.slice(0, -1), 10)
    var m = 0
    var s = 1
    while (t > 0) {
      s = (s + (t % 10) * (9 - (m++ % 6))) % 11
      t = Math.floor(t / 10)
    }
    var v = s > 0 ? '' + (s - 1) : 'K'

    if (v !== rut.slice(-1)) {
      return 'invalidRut'
    }
  },
  autoValue: async function (value, options) {
    if (!value) return
    let parts = value.split('')
    let last = parts.pop()
    let final = numeral(parts.join('')).format('0,0') + '-' + last
    final = final.replace(/,/g, '.')
    if (final.length < 4) return value
    return final
  }
}
