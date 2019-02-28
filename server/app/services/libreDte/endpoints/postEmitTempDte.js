import axios from 'axios'
import {BASE_PATH} from 'app/services/libreDte/config'

/**
 *
 *
 * @export
 * @param {*} apiKey
 * @param {*} body
 * @returns           An object containing the following keys {
 * emisor (integer): RUT del emisor sin DV ,
 * receptor (integer): RUT del receptor sin DV ,
 * dte (integer): Tipo de DTE ,
 * codigo (string): Código del DTE temporal
 * }
 */
export async function postEmitTempDte(apiKey, body) {
  const url = `${BASE_PATH}/dte/documentos/emitir`
  const headers = {Authorization: apiKey}
  const response = await axios({
    method: 'POST',
    url,
    headers,
    data: {...body}
  })
  console.log({
    level: 'INFO',
    message: 'Temporary DTE emitted',
    data: {...response.data}
  })
  return response.data
}
