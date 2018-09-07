import createPdf from './createPdf'
import escape from 'escape-string-regexp'
import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'
import Collections from 'app/collections/Collections'
import getHTML from './getHTML'

export default {
  name: 'Generar PDF desde markdown',
  optionsSchema: {
    template: {
      type: String,
      label: 'Template a usar',
      fieldType: 'html'
    },
    collectionId: {
      label: 'Collección para guardar el pdf',
      type: String,
      fieldType: 'collectionSelect'
    },
    valueKey: {
      type: String,
      label: 'Campo donde guardar el pdf',
      fieldType: 'collectionFieldSelect'
    },
    itemId: {
      type: String,
      label: 'Id del item para guardar el pdf'
    }
  },
  async execute({options, params}) {
    const {collectionId, valueKey, itemId, template} = options

    let content = template
    Object.keys(params).forEach(variable => {
      const regexp = new RegExp(`{${escape(variable)}}`, 'g')
      content = content.replace(regexp, params[variable])
    })

    const html = getHTML(content)

    const pdfOptions = {
      format: 'Letter',
      border: {top: '20px', bottom: '20px', left: '20px', right: '20px'}
    }

    const pdfResponse = {}
    pdfResponse.id = itemId
    pdfResponse.pdf = await createPdf(html, pdfOptions)

    const response = await uploadPDF(pdfResponse, 'pdf')
    const url = `https://s3.amazonaws.com/${response.bucket}/${response.key}`

    console.log('generated html pdf', url)

    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)
    if (!item) return

    await item.update({$set: {[`data.${valueKey}`]: url}})
  }
}
