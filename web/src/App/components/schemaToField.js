import ArrayComponent from 'orionsoft-parts/lib/components/fields/ArrayComponent'
import Text from 'orionsoft-parts/lib/components/fields/Text'
import NumberField from 'orionsoft-parts/lib/components/fields/numeral/Number'
import DateText from 'orionsoft-parts/lib/components/fields/DateText'
import Toggle from 'orionsoft-parts/lib/components/fields/Toggle'
import ObjectField from './fields/ObjectField'
import isArray from 'lodash/isArray'
import Blackbox from './fields/Blackbox'
import FileManager from './fields/FileManager'
import RichText from './fields/RichText'
import Document from './fields/Document'
import fieldTypes from './fieldTypes'
import ColorPicker from './fields/ColorPicker'

const singleFieldMap = {
  email: Text,
  string: Text,
  ID: Text,
  integer: NumberField,
  number: NumberField,
  array: ArrayComponent,
  plainObject: ObjectField,
  boolean: Toggle,
  date: DateText,
  blackbox: Blackbox,
  file: FileManager,
  document: Document,
  richText: RichText,
  colorpicker: ColorPicker
}

const arrayFieldMap = {}

export default function(type, field) {
  if (field.fieldType) {
    const fieldTypeData = fieldTypes[field.fieldType]
    if (fieldTypeData) {
      return fieldTypes[field.fieldType].field
    }
  }
  const fieldMap = isArray(type) ? arrayFieldMap : singleFieldMap
  let typeId = isArray(type) ? type[0] : type
  if (field.__graphQLType === 'FileInput') {
    type = 'file'
  }
  const fieldType = fieldMap[type]
  if (!fieldType) {
    const text = isArray(type) ? `[${typeId}]` : typeId
    throw new Error('No field component for type: ' + text)
  }
  return fieldType
}
