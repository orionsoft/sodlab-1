import {elapsedTime} from './countdown'

export default {
  name: 'Tiempo transcurrido',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    fecha: {
      type: String,
      label: 'Fecha'
    }
  },
  getRenderType: () => 'text',
  async getResult({collection, fieldName}) {
    const [document] = await collection
      .find()
      .limit(1)
      .sort({$natural: -1})
      .toArray()

    return `Último documento: ${elapsedTime(document.data[fieldName])}`
  }
}
