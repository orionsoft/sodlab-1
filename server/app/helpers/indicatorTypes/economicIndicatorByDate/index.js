import rp from 'request-promise'
import moment from 'moment'
import Indicators from 'app/collections/Indicators'
import types from 'app/helpers/misc/economicTypes'

export default {
  name: 'Valor: Indicador económico por fecha',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    economicIndicator: {
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
    },
    itemId: {
      type: String,
      label: 'Item ID'
    },
    indicatorId: {
      type: String,
      label: 'Indicador (Si se selecciona esta opción, se omite el valor del campo del item)',
      fieldType: 'indicatorSelect'
    }
  },
  async getRenderType({options}) {
    const format = types[options.economicIndicator.fixed.value]
      ? types[options.economicIndicator.fixed.value]
      : 'number'
    return format
  },
  async getResult({options, collection, fieldName}, params) {
    if (!options.economicIndicator) return

    let rawDate = ''
    if (options.indicatorId) {
      const indicator = await Indicators.findOne(options.indicatorId)
      const result = await indicator.result({options: params, params})
      rawDate = new Date(result)
    } else {
      const item = await collection.findOne({_id: options.itemId})
      if (!item) return null
      const result = item.data[fieldName]
      rawDate = new Date(result)
    }

    const date = moment(rawDate)
      .format('DD-MM-YYYY')
      .toString()

    const data = await rp(`https://mindicador.cl/api/${options.economicIndicator}/${date}`, {
      json: true
    }).catch(err => {
      console.log('Economic indicator by date failed to fetch from mindicador.cl', err)
      return 0
    })

    if (!data.serie.length) return 0

    const value = data.serie[0].valor

    if (types[options.economicIndicator] === 'percentage') {
      return value * 0.01
    }

    return value
  }
}
