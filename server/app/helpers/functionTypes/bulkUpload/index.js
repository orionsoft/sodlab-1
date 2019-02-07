import submitForm from 'app/resolvers/Forms/submitForm'
import Collections from 'app/collections/Collections'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'
import parseFile from './parseFile'

export default {
  name: 'Carga masiva de datos',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
    fileKey: {
      type: String,
      label: 'Campo donde está el archivo (.xlsx o .json)',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collectionId'
    },
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
    formId: {
      label:
        '(opcional) Formulario para realizar el ingreso de datos (tiene prioridad sobre la colección)',
      type: String,
      fieldType: 'formSelect',
      optional: true
    },
    targetCollectionId: {
      label:
        '(opcional) Coleccion para guardar los datos directamente, en caso de no usar un formulario',
      type: String,
      fieldType: 'collectionSelect',
      optional: true
    }
  },
  async execute({options, params, environmentId, hook, hooksData, viewer}) {
    const {template, formVariables, fileKey, formId, targetCollectionId} = options
    let db
    if (!formId && !targetCollectionId) return
    if (!formId && targetCollectionId) {
      const collection = await Collections.findOne(targetCollectionId)
      db = await collection.db()
    }

    let itemsArray = []
    const {shouldThrow} = hook
    let item = {}
    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
      itemsArray = await parseFile(item.data[fileKey])
    } catch (err) {
      console.log(
        `Error when trying to parse the file ${
          item.data[fileKey]
        } from environment ${environmentId}`
      )
      return throwHookError(err)
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

      if (!formId && targetCollectionId) {
        try {
          await db.insert({
            data,
            createdAt: new Date()
          })
        } catch (err) {
          console.log(
            `Error at saving documents to the db when running the bulkUpload hook from environment ${environmentId}`,
            err
          )
          return throwHookError(err)
        }
      } else {
        try {
          await submitForm({formId, data})
        } catch (err) {
          console.log(
            `Error at trying to insert data to the form when running the bulkUpload hook from environment ${environmentId}`,
            err
          )
          return throwHookError(err)
        }
      }
    })

    return {start: item, result: item, success: true}
  }
}
