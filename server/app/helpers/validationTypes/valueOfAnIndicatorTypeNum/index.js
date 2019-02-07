import Indicators from 'app/collections/Indicators'
import checkEmptyObject from 'app/helpers/misc/checkEmptyObject'
import checkValues from './checkValues'
import parseNumberToDate from 'app/helpers/misc/parseNumberToDate'

export default {
  name: 'Valor de un indicador (tipo número)',
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
      label: 'Tipo de validación',
      fieldType: 'select',
      fieldOptions: {
        options: [
          {label: 'Mayor o igual que', value: 'biggerOrEqualThan'},
          {label: 'Mayor que', value: 'biggerThan'},
          {label: 'Igual que', value: 'equalTo'},
          {label: 'Distinto que', value: 'notEqualTo'},
          {label: 'Menor que', value: 'smallerThan'},
          {label: 'Menor o igual que', value: 'smallerOrEqualThan'}
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
      targetIndicatorItemId
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

    let sourceIndicatorValue
    let sourceIndicatorResult = {}
    try {
      const indicator = await Indicators.findOne(sourceIndicatorId)
      const params = {
        ...data,
        [sourceIndicatorParamName]: sourceIndicatorItemId
      }
      sourceIndicatorResult = await indicator.result({filterOptions: params, params, userId})
      sourceIndicatorValue = sourceIndicatorResult
    } catch (err) {
      console.log(`Error getting an indicator in a validation`, err)
      throw new Error('La validación ha fallado')
    }

    let valueToCheck
    let targetIndicatorResult = {}
    if (targetIndicatorId) {
      const targetIndicator = await Indicators.findOne(targetIndicatorId)
      const targetParams = {...data, [targetIndicatorParamName]: targetIndicatorItemId}
      try {
        targetIndicatorResult = await targetIndicator.result({
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

    const {passValidation, failReason} = checkValues({
      validationType,
      value: sourceIndicatorValue,
      valueToCheck,
      checkForTruthy
    })
    sourceIndicatorValue = parseNumberToDate(
      sourceIndicatorResult,
      sourceIndicatorValue,
      sourceIndicatorValue
    )
    valueToCheck = parseNumberToDate(targetIndicatorResult, comparingValue, valueToCheck)

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
