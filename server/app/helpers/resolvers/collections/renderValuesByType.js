import numeral from 'numeral'
import moment from 'moment'
import Collections from 'app/collections/Collections'

const fieldTypesOp = {
  oneOf: async (value, field) => {
    const {collectionId, valueKey, labelKey} = field
    if (!collectionId || !valueKey || !labelKey) return
    const collection = await Collections.findOne(collectionId)
    const db = await collection.db()
    const searchBy = valueKey === '_id' ? '_id' : `data.${valueKey}`
    const item = await db.findOne({[searchBy]: value})
    if (!item) return
    return labelKey === '_id' ? item._id : item.data[labelKey]
  },
  manyOf: async (value, field) => {
    const {collectionId, valueKey, labelKey} = field
    if (!collectionId || !valueKey || !labelKey) return []
    const collection = await Collections.findOne(collectionId)
    const db = await collection.db()
    const searchBy = valueKey === '_id' ? '_id' : `data.${valueKey}`
    const items = await db.find({[searchBy]: {$in: value}}).toArray()
    if (!items) return []
    return value.map(itemKey => {
      const item = items.find(item => {
        const itemId = valueKey === '_id' ? item._id : item.data[valueKey]
        return itemId === itemKey
      })
      if (!item) return 'No encontrado'
      return labelKey === '_id' ? item._id : item.data[labelKey]
    })
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

export default async function(field, value) {
  if (value) {
    return fieldTypesOp[field.type] ? await fieldTypesOp[field.type](value, field) : value
  } else {
    return null
  }
}
