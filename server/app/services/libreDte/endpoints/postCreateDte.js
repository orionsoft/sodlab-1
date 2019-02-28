import axios from 'axios'
import {BASE_PATH} from 'app/services/libreDte/config'

/**
 * In this post request you have to send the result from a temporary DTE.
 * The result from postEmitTempDte matches each argument in the function
 *
 * @export
 * @param {*} apiKey
 * @param {*} emisor
 * @param {*} receptor
 * @param {*} dte
 * @param {*} codigo
 * @returns{
emisor (integer): RUT del emisor de DTE sin DV ,
dte (integer): Tipo de DTE ,
folio (integer): Folio del DTE ,
certificacion (boolean): Define si el DTE es o no de ambiente de certificación ,
tasa (number, optional): Tasa del impuesto (IVA) en porcentaje ,
fecha (string): Fecha de emisión del DTE ,
sucursal_sii (integer, optional): Código de sucursal del emisor asignada por el SII ,
receptor (integer): RUT del receptor del DTE sin dv ,
exento (integer, optional): Monto exento del DTE ,
neto (integer, optional): Monto neto del DTE ,
iva (integer, optional): Monto del IVA del DTE ,
total (integer): Total del DTE ,
usuario (integer): ID del usuario que emitió el DTE ,
track_id (integer, optional): Track ID del envío del DTE al SII ,
revision_estado (string, optional): Estado del envío del DTE al SII ,
revision_detalle (string, optional): Detalles del envío del DTE al SII
}
 */
export async function postCreateDte(apiKey, emisor, receptor, dte, codigo) {
  const url = `${BASE_PATH}/dte/documentos/generar`
  const headers = {Authorization: apiKey}
  const data = {emisor, receptor, dte, codigo}
  const response = await axios({
    method: 'POST',
    url,
    headers,
    data
  })
  console.log({
    level: 'INFO',
    message: `Created a DTE for the temporary DTE with the code ${codigo}`,
    data: {...response.data}
  })
  return response.data
}
