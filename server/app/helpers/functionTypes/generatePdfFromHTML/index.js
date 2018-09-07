import createPdf from './createPdf'
import escape from 'escape-string-regexp'
import uploadPDF from './uploadPDF'
import Collections from 'app/collections/Collections'
import getHTML from './getHTML'

export default {
  name: 'Generar PDF desde HTML',
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

    const file = await createPdf(html)
    const response = await uploadPDF(file)
    const url = `https://s3.amazonaws.com/${response.bucket}/${response.key}`

    console.log('generated html pdf', url)

    const col = await Collections.findOne(collectionId)
    const collection = await col.db()
    const item = await collection.findOne(itemId)
    if (!item) return

    await item.update({$set: {[`data.${valueKey}`]: url}})
  }
}
