import rp from 'request-promise'
import types from 'app/helpers/misc/economicTypes'

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
          {label: 'Unidad de fomento (UF)', value: 'uf'},
          {label: 'Unidad Tributaria Mensual (UTM)', value: 'utm'},
          {label: 'Indice de Precios al Consumidor (IPC)', value: 'ipc'},
          {label: 'Tasa Política Monetaria (TPM)', value: 'tpm'},
          {label: 'Imacec', value: 'imacec'},
          {label: 'Indice de valor promedio (IVP)', value: 'ivp'},
          {label: 'Dólar observado', value: 'dolar'},
          {label: 'Dólar acuerdo (intercambio)', value: 'dolar_intercambio'},
          {label: 'Euro', value: 'euro'},
          {label: 'Libra de cobre', value: 'libra_cobre'},
          {label: 'Bitcoin', value: 'bitcoin'},
          {label: 'Tasa de desempleo', value: 'tasa_desempleo'}
        ]
      }
    }
  },
  async getRenderType({options}) {
    const format = types[options.indicator.fixed.value]
      ? types[options.indicator.fixed.value]
      : 'number'
    return format
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
