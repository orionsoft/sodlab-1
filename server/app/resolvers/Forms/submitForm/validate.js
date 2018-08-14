import {validate, clean} from '@orion-js/schema'
import Validations from 'app/collections/Validations'

export default async function({form, rawData}) {
  /**
   * Validates with the form schema
   */
  const schema = await form.schema()
  let data = await clean(schema, rawData)
  try {
    await validate(schema, data)
  } catch (error) {
    if (error.isValidationError) {
      throw error.prependKey('data')
    }
    throw error
  }

  /**
   * Validates with the collection schema
   */
  const collection = await form.collection()
  const collectionSchema = await collection.schema()
  data = await clean(collectionSchema, data)
  try {
    await validate(collectionSchema, data, {omitRequired: form.type === 'update'})
  } catch (error) {
    if (error.isValidationError) {
      throw error.prependKey('data')
    }
    throw error
  }

  for (const validationId of form.validationsIds || []) {
    const validation = await Validations.findOne(validationId)
    await validation.execute({params: data})
  }

  return data
}
