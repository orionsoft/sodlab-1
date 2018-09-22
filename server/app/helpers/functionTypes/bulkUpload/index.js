import submitForm from 'app/resolvers/Forms/submitForm'
import Collections from 'app/collections/Collections'
import parseFile from './parseFile'

export default {
  name: 'Carga masiva de datos',
  optionsSchema: {
    template: {
      type: String,
      label:
        'Template formato JSON a usar (ej: {"collectionKeyName": "Nombre de la columna en la planilla"})',
      fieldType: 'textArea'
    },
    formVariables: {
      type: String,
      label:
        '(Opcional) Mapeo de variables del formulario en formato JSON (ej: {"targetKeyName":"sourceKeyName"})',
      fieldType: 'textArea',
      optional: true
    },
    sourceCollectionId: {
      label: 'Coleccion en donde se sube el archivo',
      type: String,
      fieldType: 'collectionSelect'
    },
    fileKey: {
      type: String,
      label: 'Campo donde está el archivo (.xlsx o .json)',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'sourceCollectionId'
    },
    formId: {
      label: 'Formulario para realizar el ingreso de datos (tiene prioridad sobre la colección)',
      type: String,
      fieldType: 'formSelect',
      optional: true
    },
    targetCollectionId: {
      label: 'Coleccion para guardar los datos directamente, en caso de no usar un formulario',
      type: String,
      fieldType: 'collectionSelect',
      optional: true
    }
  },
  async execute({options, params}) {
    const {template, formVariables, fileKey, formId, targetCollectionId} = options
    let db
    if (!formId && !targetCollectionId) return
    if (!formId && targetCollectionId) {
      const collection = await Collections.findOne(targetCollectionId)
      db = await collection.db()
    }

    let itemsArray = []
    try {
      itemsArray = await parseFile(params[fileKey])
    } catch (err) {
      throw new Error('No se pudo procesar el archivo')
    }

    const parsedTemplate = JSON.parse(template)
    itemsArray.map(async item => {
      let data = {}
      Object.keys(parsedTemplate).map(templateKey => {
        const templateValue = parsedTemplate[templateKey]
        data = {...data, [templateKey]: item[templateValue]}
      })
      if (formVariables) {
        const formTemplate = JSON.parse(formVariables)
        Object.keys(formTemplate).map(formKey => {
          const formValue = formTemplate[formKey]
          data = {...data, [formKey]: params[formValue]}
        })
      }

      try {
        if (!formId && targetCollectionId) {
          await db.insert({
            data,
            createdAt: new Date()
          })
        } else {
          await submitForm({formId, data})
        }
      } catch (err) {
        throw new Error('No se pudo ingresar el set de datos')
      }
    })
  }
}