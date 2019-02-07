import Indicators from 'app/collections/Indicators'
import checkEmptyObject from 'app/helpers/misc/checkEmptyObject'
import checkValues from './checkValues'

export default {
  name: 'Valor de un indicador (tipo texto)',
  optionsSchema: {
    sourceIndicatorId: {
      type: String,
      label: 'Indicador a usar',
      fieldType: 'indicatorSelect'
    },
    sourceIndicatorParamName: {
      type: String,
      label: '(opcional) Nombre del parametro del ID para pasarlo a indicadores',
      optional: true
    },
    sourceIndicatorItemId: {
      type: String,
      label: '(opcional) Item ID a pasar al indicador',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'sourceCollectionId',
      optional: true
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
    targetIndicatorId: {
      type: String,
      label: '(opcional) Indicador a usar. Si se selecciona, el campo "Valor a buscar" no se usará',
      fieldType: 'indicatorSelect',
      optional: true
    },
    targetIndicatorParamName: {
      type: String,
      label: '(opcional) Nombre del parametro del ID para pasarlo a indicadores',
      optional: true
    },
    targetIndicatorItemId: {
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
        '(opcional) Mensaje personalizado. Usar {{value}} para referirse al indicador y {{targetValue}} para referirse al valor contra el cual se compara',
      optional: true
    }
  },
  async execute({
    options: {
      sourceIndicatorId,
      sourceIndicatorParamName,
      sourceIndicatorItemId,
      comparingValue,
      targetIndicatorId,
      targetIndicatorParamName,
      targetIndicatorItemId,
      caseSensitive
    },
    params: {validationType, checkForTruthy, message},
    formId,
    data,
    userId
  }) {
    const formIsEmpty = checkEmptyObject(data)
    if (formIsEmpty) {
      throw new Error('Los campos del formulario están vacios')
    }

    let sourceIndicatorValue = {}
    try {
      const indicator = await Indicators.findOne(sourceIndicatorId)
      const params = {
        ...data,
        [sourceIndicatorParamName]: sourceIndicatorItemId
      }
      const result = await indicator.result({filterOptions: params, params, userId})
      sourceIndicatorValue = result
    } catch (err) {
      console.log(`Error getting an indicator in a validation`, err)
      throw new Error('La validación ha fallado')
    }

    let valueToCheck
    if (targetIndicatorId) {
      const targetIndicator = await Indicators.findOne(targetIndicatorId)
      const targetParams = {...data, [targetIndicatorParamName]: targetIndicatorItemId}
      try {
        const targetIndicatorResult = await targetIndicator.result({
          filterOptions: targetParams,
          params: targetParams,
          userId
        })
        valueToCheck = targetIndicatorResult
      } catch (err) {
        console.log(`Error getting an indicator in a validation`, err)
        throw new Error('La validación ha fallado')
      }
    } else {
      valueToCheck = comparingValue
    }

    let passValidation
    let failReason = ''
    const options = caseSensitive ? '' : 'i'
    switch (validationType) {
      case 'contains': {
        const regex = new RegExp(escape(valueToCheck), options)
        passValidation = checkValues({regex, value: sourceIndicatorValue, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe contener "${valueToCheck}"`
          : `debe contener "${valueToCheck}"`
        break
      }
      case 'startsWith': {
        const regex = new RegExp('^' + escape(valueToCheck), options)
        passValidation = checkValues({regex, value: sourceIndicatorValue, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe comenzar con "${valueToCheck}"`
          : `debe comenzar con "${valueToCheck}"`
        break
      }
      case 'equalsTo': {
        const regex = new RegExp('^' + escape(valueToCheck) + '$', options)
        passValidation = checkValues({regex, value: sourceIndicatorValue, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe ser igual a "${valueToCheck}"`
          : `debe ser igual a "${valueToCheck}"`
        break
      }
      case 'endsWith': {
        const regex = new RegExp(escape(valueToCheck) + '$', options)
        passValidation = checkValues({regex, value: sourceIndicatorValue, checkForTruthy})
        failReason = checkForTruthy
          ? `no debe terminar con "${valueToCheck}"`
          : `debe terminar con "${valueToCheck}"`
        break
      }
      default:
        break
    }

    if (!passValidation) {
      if (message) {
        let errorMessage = message.replace('{{value}}', sourceIndicatorValue)
        errorMessage = errorMessage.replace('{{targetValue}}', valueToCheck)
        throw new Error(errorMessage)
      }
      throw new Error(`${sourceIndicatorValue} ${failReason}`)
    }

    // exit the function if all the fields pass the condition
    return
  }
}
