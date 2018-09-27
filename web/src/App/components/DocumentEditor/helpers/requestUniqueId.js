import apiUrl from './url'

export default async function() {
  try {
    const response = await fetch(`${apiUrl}/api/others/id`)
    const {id} = await response.json()
    return id
  } catch (error) {
    console.log(error)
    throw new Error('No se puede generar un nombre único en este momento')
  }
}
