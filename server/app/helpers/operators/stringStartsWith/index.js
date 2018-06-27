export default {
  name: 'Empieza con',
  inputType: 'string',
  async resolve(value) {
    console.log('hay que arreglar este operador')
    return {$exists: value}
  }
}
