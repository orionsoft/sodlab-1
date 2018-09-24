import downloadFile from './downloadFile'
import parseExcelFile from './parseExcelFile'

export default async function({bucket, key, type}) {
  let itemsArray = []
  let buffer
  try {
    buffer = await downloadFile(bucket, key)
  } catch (err) {
    throw new Error('Error al descargar el archivo')
  }

  return new Promise(function(resolve, reject) {
    switch (type) {
      case 'application/json':
        const json = JSON.parse(buffer.toString('utf8'))
        if (Array.isArray(json)) {
          itemsArray = json
        } else {
          itemsArray.push(json)
        }
        resolve(itemsArray)
        break
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
        itemsArray = parseExcelFile(buffer)
        resolve(itemsArray)
        break
      default:
        reject('Tipo de archivo incorrecto')
    }
  })
}
