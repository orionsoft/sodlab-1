import uploadPDF from 'app/helpers/functionTypes/helpers/uploadPDF'
import Collections from 'app/collections/Collections'
import prependKey from 'app/helpers/misc/prependKey'
import createPdf from './createPdf'
import Indicators from 'app/collections/Indicators'

export default {
  name: 'Generar PDF',
  requireField: false,
  optionsSchema: {
    content: {
      type: String,
      fieldType: 'richText',
      label: 'Contenido del pdf'
    },
    indicatorsIds: {
      type: [String],
      label: 'Indicadores a insertar en el pdf',
      fieldType: 'indicatorSelect',
      fieldOptions: {multi: true},
      optional: true
    },
    parameters: {
      type: String,
      label: 'Parámetros a insertar en el pdf',
      optional: true
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
    itemId: {
      type: String,
      label: 'Id del item de la colección donde guardar el archivo'
    },
    urlField: {
      type: String,
      label: 'Campo donde insertar el url del pdf',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collectionId'
    }
  },
  async execute({options, params}) {
    if (!options.urlField) throw Error('urlField no encontrado')
    const parameters = options.parameters
      .split(',')
      .map(p => {
        const cleanedParameter = p.trim()
        return params[cleanedParameter]
      })
      .filter(i => i)

    const indicators = []
    if (options.indicatorsIds) {
      for (const indicatorId of options.indicatorsIds) {
        const indicator = await await Indicators.findOne(indicatorId)
        const value = await indicator.result({filterOptions: params, params})
        indicators.push(value)
      }
    }

    const a = 97
    const scope = {}
    for (let i = 0; i < parameters.length; i++) {
      scope[`p-${String.fromCharCode(a + i)}`] = parameters[i]
    }

    for (let i = 0; i < indicators.length; i++) {
      scope[`i-${String.fromCharCode(a + i)}`] = indicators[i]
    }

    let result = options.content
    Object.keys(scope).forEach(variable => {
      const regexp = new RegExp(`{${variable}}`, 'g')
      result = result.replace(regexp, scope[variable])
    })

    const pdfOptions = {
      format: 'Letter',
      header: {height: '5mm'},
      footer: {height: '5mm'},
      border: {top: '30px', bottom: '30px', left: '10px'}
    }
    let pdfResponse = {}
    pdfResponse.id = options.itemId
    pdfResponse.pdf = await createPdf(result, pdfOptions)

    const response = await uploadPDF(pdfResponse, 'pdf')
    const data = {}
    data[options.urlField] = `https://s3.amazonaws.com/${response.bucket}/${response.key}`
    const $set = prependKey(data, 'data')

    const collection = await Collections.findOne(options.collectionId)
    const itemCollection = await collection.db()
    const itemToUpdate = await itemCollection.findOne(options.itemId)

    await itemToUpdate.update({$set})
  }
}
