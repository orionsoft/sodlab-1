import apiUrl from './url'

export default async function(params) {
  const response = await fetch(`${apiUrl}/api/others/signUrl`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify({...params})
  })
  try {
    const {data} = await response.json()
    return data
  } catch (error) {
    console.log(error)
    throw new Error('No se pueden subir archivos en este momento')
  }
}
