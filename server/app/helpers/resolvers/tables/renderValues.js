import tableRelationLabel from 'app/resolvers/Tables/tableRelationLabel'
import tableRelationLabels from 'app/resolvers/Tables/tableRelationLabels'
import numeral from 'numeral'
import moment from 'moment'

const fieldTypesOp = {
  oneOf: async (value, field, tableId) => {
    let result = await tableRelationLabel({tableId, fieldName: field.name, value})
    return await result
  },
  manyOf: async (value, field, tableId) => {
    let array = await tableRelationLabels({tableId, fieldName: field.name, value})
    let result = ((await array) || []).join(', ')
    return result
  },
  document: value => {
    return value.name
  },
  currency: value => {
    return numeral(value).format('$0,0')
  },
  file: value => {
    return value.name
  },
  boolean: (value, field) => {
    return value ? field.options.trueLabel : field.options.falseLabel
  },
  checkbox: (value, field) => {
    return value ? field.options.trueLabel : field.options.falseLabel
  },
  datetime: value => {
    return moment(value).format('DD/MM/YYYY HH:mm')
  },
  percentage: value => {
    if ((value * 100) % 1 !== 0) {
      return (numeral(value).format('0.0[0000]') * 100).toFixed(2) + '%'
    } else {
      return (numeral(value).format('0.0[0000]') * 100).toFixed(0) + '%'
    }
  },
  singleSelect: (value, field) => {
    const selectValue = field.options.options.find(option => {
      return option.value === value
    })
    return selectValue ? selectValue.label : ''
  },
  multipleSelect: (value, field) => {
    const values = value.map(option => {
      return field.options.options.find(getValue => {
        return getValue.value === option
      })
    })
    const valueArray = values.map(result => {
      return result.label
    })
    return (valueArray || []).join(', ')
  },
  phone: value => {
    return '+56' + value
  }
}

export default function(tableId, item, colFields) {
  let renderedObject = {}
  Object.keys(item).map(async key => {
    const field = colFields.find(field => field.name === key)
    if (item[key]) {
      renderedObject[field.label] = fieldTypesOp[field.type]
        ? await fieldTypesOp[field.type](item[key], field, tableId)
        : item[key]
    } else {
      renderedObject[field.label] = null
    }
  })
  return renderedObject
}
