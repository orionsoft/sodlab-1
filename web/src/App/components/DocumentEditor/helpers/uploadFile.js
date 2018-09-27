export default async function(signedRequest, file, contentType = null) {
  let options = {
    method: 'PUT',
    body: file
  }
  if (contentType) {
    const headers = {
      'Content-Type': contentType
    }
    options = {...options, headers}
  }
  try {
    const response = await fetch(signedRequest, options)
    if (!response.ok) return this.props.showMessage('Error al enviar al subir el archivo')
  } catch (error) {
    console.log(error)
    this.props.showMessage('Error al subir el archivo')
  }
}
