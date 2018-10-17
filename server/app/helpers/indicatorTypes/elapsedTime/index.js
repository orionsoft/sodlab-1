import {elapsedTime} from './countdown'

export default {
  name: 'Tiempo transcurrido',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    itemId: {
      type: String,
      label: 'Item Id'
    }
  },
  getRenderType: () => 'text',
  async getResult({collection, fieldName, options: {itemId}}) {
    const [document] = await collection.find({_id: itemId}).toArray()
    return `${elapsedTime(document.data[fieldName])}`
  }
}
