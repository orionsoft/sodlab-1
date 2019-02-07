import escape from 'escape-string-regexp'
import Forms from 'app/collections/Forms'
import Indicators from 'app/collections/Indicators'
import checkEmptyObject from 'app/helpers/misc/checkEmptyObject'
import concatenateWords from 'app/helpers/misc/concatenateWords'
import checkFields from './checkFields'

export default {
  name: 'Campos de un documento (tipo texto)',
  optionsSchema: {
    collectionId: {
      type: String,
      label: 'Colección donde buscar',
      fieldType: 'collectionSelect'
    },
    fields: {
      type: [String],
      label: 'Campo(s) sobre el cual buscar',
      fieldType: 'collectionFieldSelect',
      fieldOptions: {multi: true}
    },
    validationType: {
      type: String,
      label: 'Tipo de validación (Los valores que no son texto serán transformados a texto)',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Contiene', value: 'contains'},
          {label: 'Empieza con', value: 'startsWith'},
          {label: 'Igual a', value: 'equalsTo'},
          {label: 'Termina con', value: 'endsWith'}
        ]
      }
    },
    comparingValue: {
      type: String,
      label: '(opcional) Valor a buscar',
      optional: true
    },
    indicatorId: {
      type: String,
      label: '(opcional) Indicador a usar. Si se selecciona, el campo "Valor a buscar" no se usará',
      fieldType: 'indicatorSelect',
      optional: true
    },
    indicatorParamName: {
      type: String,
      label: '(opcional) Nombre del parametro del ID para pasarlo a indicadores',
      optional: true
    },
    indicatorItemId: {
      type: String,
      label: '(opcional) Item ID a pasar al indicador',
      optional: true
    },
    caseSensitive: {
      label: 'Distinguir mayúsculas de minúsculas',
      type: Boolean,
      fieldType: 'select',
      fieldOptions: {
        options: [{label: 'Si', value: true}, {label: 'No', value: false}]
      },
      defaultValue: false
    },
    checkForTruthy: {
      label: 'La operación se bloquea cuando...',
      type: Boolean,
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Se cumple la condición', value: true},
          {label: 'No se cumple la condición', value: false}
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
    options: {comparingValue, indicatorId, indicatorParamName, indicatorItemId},
    params: {fields, validationType, caseSensitive, checkForTruthy, message, useFormEditableLabels},
    formId,
    data,
    userId
  }) {
    const formIsEmpty = checkEmptyObject(data)
    if (formIsEmpty) {
      throw new Error('Los campos del formulario están vacios')
    }

    let valueToCheck = ''
    if (indicatorId) {
      try {
        const indicator = await Indicators.findOne(indicatorId)
        const params = {
          ...data,
          [indicatorParamName]: indicatorItemId
        }
        const result = await indicator.result({filterOptions: params, params, userId})
        valueToCheck = result.toString()
      } catch (err) {
        console.log(`Error getting an indicator in a validation`, err)
        throw new Error('La validación ha fallado')
      }
    } else {
      valueToCheck = comparingValue
    }

    let failedFields = []
    let failReason = ''
    const options = caseSensitive ? '' : 'i'
    switch (validationType) {
      case 'contains': {
        const regex = new RegExp(escape(valueToCheck), options)
        failedFields = checkFields({data, fields, regex, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe(n) contener "${valueToCheck}"`
          : `debe(n) contener "${valueToCheck}"`
        break
      }
      case 'startsWith': {
        const regex = new RegExp('^' + escape(valueToCheck), options)
        failedFields = checkFields({data, fields, regex, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe(n) comenzar con "${valueToCheck}"`
          : `debe(n) comenzar con "${valueToCheck}"`
        break
      }
      case 'equalsTo': {
        const regex = new RegExp('^' + escape(valueToCheck) + '$', options)
        failedFields = checkFields({data, fields, regex, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe(n) ser igual a "${valueToCheck}"`
          : `debe(n) ser igual a "${valueToCheck}"`
        break
      }
      case 'endsWith': {
        const regex = new RegExp(escape(valueToCheck) + '$', options)
        failedFields = checkFields({data, fields, regex, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe(n) terminar con "${valueToCheck}"`
          : `debe(n) terminar con "${valueToCheck}"`
        break
      }
      default:
        break
    }

    failedFields = failedFields.filter(field => typeof field !== 'undefined')
    let errorMessage = ''
    let labels = ''
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
