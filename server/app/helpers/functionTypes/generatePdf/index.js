import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'
import Collections from 'app/collections/Collections'
import prependKey from 'app/helpers/misc/prependKey'
import createPdf from './createPdf'

export default {
  name: 'Generar PDF',
  optionsSchema: {
    content: {
      type: String,
      fieldType: 'richText',
      label: 'Contenido del pdf'
    },
    name: {
      type: String,
      label: 'Nombre del archivo pdf'
    },
    collectionId: {
      label: 'Colección',
      type: String,
      fieldType: 'collectionSelect'
    },
    urlField: {
      type: String,
      label: 'Campo donde insertar el url del pdf',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collectionId'
    }
  },
  async execute({options: {content, name, collectionId, urlField}, itemId}) {
    const options = {format: 'Letter'}

    let pdfResponse = {}
    pdfResponse.id = itemId
    pdfResponse.pdf = await createPdf(content, options)

    const response = await uploadPDF(pdfResponse, 'pdf')
    const data = {}
    data[urlField] = `https://s3.amazonaws.com/${response.bucket}/${response.key}`
    const $set = prependKey(data, 'data')

    const collection = await Collections.findOne(collectionId)
    const itemCollection = await collection.db()
    const itemToUpdate = await itemCollection.findOne(itemId)

    await itemToUpdate.update($set)
  }
}
