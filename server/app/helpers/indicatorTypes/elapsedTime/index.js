import {elapsedTime} from './countdown'

export default {
  name: 'Tiempo transcurrido',
  requireCollection: true,
  requireField: true,
  optionsSchema: {
    fecha: {
      type: String,
      label: 'Fecha'
    },
    operation: {
      type: String,
      label: 'Operación',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {
            label: 'Timpo transcurrido desde el último documento',
            value: 'elapsedTimeLastDocument'
          }
        ]
      }
    }
  },
  getRenderType: () => 'text',
  async getResult({options, collection, fieldName}) {
    const [document] = await collection
      .find()
      .limit(1)
      .sort({$natural: -1})
      .toArray()

    const documents = await collection
      .find()
      .toArray()

    //all documents, insert in the field date between elapsed time
    console.log(documents)

    return `Último documento: ${elapsedTime(document.data.fecha)}`
  }
}
