import cloneDeep from 'lodash/cloneDeep'

export default function(form, rawData, currentUser) {
  let newRawData = cloneDeep(rawData)

  for (const field of form.fields) {
    if (field.parameterName && field.parameterName.includes('currentUser')) {
      newRawData[field.fieldName] = currentUser[field.fieldName]
    }
  }

  return newRawData
}
