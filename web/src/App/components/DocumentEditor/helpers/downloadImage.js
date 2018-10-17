import requestSignedUrl from './requestSignedUrl'
import arrayBufferToBase64 from './arrayBufferToBase64'

export default async function(params) {
  try {
    const signedRequest = await requestSignedUrl(params)
    const response = await fetch(signedRequest)
    const buffer = await response.arrayBuffer()
    const base64Flag = 'data:image/png;base64,'
    const imageStr = arrayBufferToBase64(buffer)
    const src = base64Flag + imageStr
    return src
  } catch (error) {
    console.log(error)
    throw new Error('Error al descargar la imagen de la página')
  }
}
