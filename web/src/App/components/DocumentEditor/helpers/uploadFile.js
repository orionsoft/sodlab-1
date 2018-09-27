export default async function(signedRequest, file, contentType) {
  const options = {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': contentType
    }
  }

  try {
    const response = await fetch(signedRequest, options)
    if (!response.ok) return this.props.showMessage('Error al enviar al subir el archivo')
  } catch (error) {
    console.log(error)
    this.props.showMessage('Error al subir el archivo')
  }
}
