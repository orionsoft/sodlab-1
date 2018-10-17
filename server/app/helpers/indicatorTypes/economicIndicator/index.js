import rp from 'request-promise'

const types = {
  ipc: 'percentage',
  tasa_desempleo: 'percentage'
}

export default {
  name: 'Valor: Indicador económico',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    indicator: {
      type: String,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Valor de la UF', value: 'uf'},
          {label: 'Valor del dolar', value: 'dolar'},
          {label: 'Valor del euro', value: 'euro'},
          {label: 'IPC', value: 'ipc'},
          {label: 'Tasa de desempleo', value: 'tasa_desempleo'},
          {label: 'Libra de cobre', value: 'libra_cobre'}
        ]
      }
    }
  },
  async getRenderType({options}) {
    return types[options.indicator] || 'money'
  },
  async getResult({options}) {
    if (!options.indicator) return

    const data = await rp('https://mindicador.cl/api', {json: true})

    if (types[options.indicator] === 'percentage') {
      return data[options.indicator].valor * 0.01
    }

    return data[options.indicator].valor
  }
}
