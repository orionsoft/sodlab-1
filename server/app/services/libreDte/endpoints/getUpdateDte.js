import {BASE_PATH} from 'app/services/libreDte/config'
import axios from 'axios'

/**
 * Receives the input from a created DTE. The result from postCreateDte matches each argument.
 * 
 * @export
 * @param {*} apiKey
 * @param {*} dte
 * @param {*} folio
 * @param {*} emisor
 * @returns
 *  {
track_id (integer): Track ID del envío del DTE al SII ,
revision_estado (string): Estado del envío del DTE al SII ,
revision_detalle (string): Detalles del envío del DTE al SII
}
 */
export async function getUpdateDte(apiKey, dte, folio, emisor) {
  const url = `${BASE_PATH}/dte/dte_emitidos/actualizar_estado/${dte}/${folio}/${emisor}`
  const headers = {Authorization: apiKey}
  const response = await axios({
    method: 'GET',
    url,
    headers
  })
  console.log({
    level: 'INFO',
    message: `Updated the DTE with the folio: ${folio}`,
    data: {...response.data}
  })
  return response.data
}
