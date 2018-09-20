import submitForm from 'app/resolvers/Forms/submitForm'
import parseFile from './parseFile'

export default {
  name: 'Carga masiva de datos',
  optionsSchema: {
    template: {
      type: String,
      label: 'Template a usar (JSON)',
      fieldType: 'textArea'
    },
    fileKey: {
      type: String,
      label: 'Campo donde está el archivo (.xlsx o .json)',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'sourceCollectionId'
    },
    formId: {
      label: 'Formulario para realizar el ingreso de datos',
      type: String,
      fieldType: 'formSelect'
    }
  },
  async execute({options, params}) {
    console.log('options', options)
    console.log('params', params)
    const {template, fileKey, formId} = options
    let itemsArray = []

    try {
      itemsArray = await parseFile(params[fileKey])
    } catch (err) {
      console.log('No se pudo procesar el archivo, err: ', err)
    }

    const parsedTemplate = JSON.parse(template)

    itemsArray.map(async item => {
      let data = {}
      Object.keys(parsedTemplate).map(templateKey => {
        const templateValue = parsedTemplate[templateKey]
        data = {...data, [templateKey]: item[templateValue]}
      })

      try {
        await submitForm({formId, data})
      } catch (err) {
        console.log('Set de datos incompletos, err: ', err)
      }
    })
  }
}
