import axios from 'axios'
import {BASE_PATH} from 'app/services/libreDte/config'

/**
 *
 *
 * @export
 * @param {*} apiKey      The key to communicate with the LibreDTE API
 * @param {*} dte         The number of the DTE document
 * @param {*} rutEmisor   The rut of the issuer without dashes and dots
 * @returns               An object wich contains the following fields
 * { emisor: 76803104,
 *   dte: 34,
 *   certificacion: 1,
 *   siguiente: 103,
 *   disponibles: 48,
 *   alerta: 5,
 *   alertado: 0 }
 */
export async function getDteAdminInfo(apiKey, dte, rutEmisor) {
  const url = `${BASE_PATH}/dte/admin/dte_folios/info/${dte}/${rutEmisor}`
  const headers = {Authorization: apiKey}
  const response = await axios({
    method: 'GET',
    url,
    headers
  })
  const result = response.data
  console.log({
    level: 'INFO',
    message: 'Requerimiento de información de Folios a LibreDTE',
    result
  })
  return result
}
