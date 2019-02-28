import axios from 'axios'
import {BASE_PATH} from 'app/services/libreDte/config'

/**
 *
 *
 * @export
 * @param {*} apiKey
 * @param {*} dte
 * @param {*} folio
 * @param {*} emisor
 */
export async function getTedOfADte(apiKey, dte, folio, emisor) {
  const url = `${BASE_PATH}/dte/dte_emitidos/ted/${dte}/${folio}/${emisor}`
  const headers = {Authorization: apiKey}
  const response = await axios({
    method: 'GET',
    url,
    headers,
    responseType: 'arraybuffer'
  })
  return response
}
