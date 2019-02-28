import {getDteAdminInfo} from 'app/services/libreDte/endpoints'
import {DTEs} from 'app/services/libreDte/config'

export default {
  name: 'Libre DTE: Obtener información del emisor',
  requireCollection: false,
  requireField: false,
  optionsSchema: {
    apiKey: {
      type: String,
      label: 'API Key para comunicarse con la API de Libre DTE'
    },
    dte: {
      label: 'Tipo de DTE',
      type: String,
      fieldType: 'select',
      fieldOptions: {options: DTEs}
    },
    rutEmisor: {
      type: String,
      label: 'RUT del emisor'
    },
    field: {
      type: String,
      label: 'Consulta a realizar',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Contribuyente al que está registrado el folio', value: 'emisor'},
          {label: 'Tipo de DTE del folio', value: 'dte'},
          {label: 'Si el folio es del ambiente de certificación', value: 'certificacion'},
          {label: 'Siguiente folio disponible ', value: 'siguiente'},
          {label: 'Cantidad de folios disponibles ', value: 'disponibles'},
          {
            label:
              'Cantidad de folios disponibles con los que se alertará al administrador de la empresa',
            value: 'alerta'
          },
          {label: 'Si la alerta ya fue envíada', value: 'alertado'}
        ]
      }
    }
  },
  getRenderType: () => 'text',
  async getResult({options: {apiKey, dte, rutEmisor, field}}) {
    const rutEmisorWithoutDots = rutEmisor.replace(/\./g, '')
    const rutEmisorWithoutDotsAndDash = rutEmisorWithoutDots.includes('-')
      ? rutEmisorWithoutDots.split('-')[0]
      : rutEmisorWithoutDots
    const infoEmisor = await getDteAdminInfo(apiKey, dte, rutEmisorWithoutDotsAndDash)
    switch (field) {
      case 'dte': {
        const result = DTEs.filter(doc => doc.value == infoEmisor[field])[0].label
        return result
      }
      case 'certificacion': {
        // The api documentation says that "certificacion" should be a boolean
        // But right now is returning 0 (prod) or 1 (dev)
        const result = !infoEmisor[field] ? 'Producción' : 'Certificación'
        return result
      }
      default: {
        return infoEmisor[field]
      }
    }
  }
}
