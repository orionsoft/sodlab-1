import Forms from 'app/collections/Forms'
import checkFields from './checkFields'

export default {
  name: 'Campo contiene datos',
  optionsSchema: {
    collectionId: {
      type: String,
      label: 'Colección donde buscar',
      fieldType: 'collectionSelect'
    },
    fields: {
      type: [String],
      label: 'Campo(s) a verificar si contienen algún valor',
      fieldType: 'collectionFieldSelect',
      fieldOptions: {multi: true}
    },
    checkForTruthy: {
      label: 'La operación se bloquea cuando...',
      type: Boolean,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Los campos contienen algún valor', value: true},
          {label: 'Los campos no contienen valor alguno', value: false}
        ]
      }
    },
    message: {
      type: String,
      label:
        '(opcional) Mensaje personalizado, se puede acceder a los campos que cumplen/no cumplen la condición usando {{titulos}} en el texto. (Por defecto, cada tipo de validación tiene su propio mensaje)',
      optional: true
    },
    useFormEditableLabels: {
      type: Boolean,
      label: '(opcional) Usar los títulos de los campos del formulario para los mensajes',
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      optional: true
    }
  },
  async execute({
    params: {fields, checkForTruthy, message, useFormEditableLabels},
    formId,
    data,
    userId
  }) {
    const formKeys = Object.keys(data)

    let failedFields = checkFields({data, formKeys, fields, checkForTruthy})
    let errorMessage = ''
    let labels = ''
    let failReason = checkForTruthy ? 'deben estar vacios' : 'no deben estar vacios'
    if (failedFields.length > 1) {
      labels = concatenateWords(failedFields)
      errorMessage = `Los campos "${labels}" ${failReason}`
    } else if (failedFields.length === 1) {
      labels = failedFields[0]
      errorMessage = `Los campos "${labels}" ${failReason}`
    } else {
      // exit the function if all the fields pass the condition
      return
    }
    if (message) errorMessage = message
    errorMessage = errorMessage.replace('{{titulos}}', labels)
    if (!useFormEditableLabels) throw new Error(errorMessage)
    if (!formId) throw new Error(errorMessage)

    const form = await Forms.findOne(formId)
    const formLabels = form.fields
      .filter(field => failedFields.includes(field.fieldName))
      .map(field => field.editableLabel)
    if (formLabels.length > 1) {
      labels = concatenateWords(formLabels)
      if (message) throw new Error(message.replace('{{titulos}}', labels))
      throw new Error(`Los campos "${labels}" ${failReason}`)
    } else if (formLabels.length === 1) {
      labels = formLabels[0]
      if (message) throw new Error(message.replace('{{titulos}}', labels))
      throw new Error(`Los campos "${labels}" ${failReason}`)
    } else {
      return
    }
  }
}
