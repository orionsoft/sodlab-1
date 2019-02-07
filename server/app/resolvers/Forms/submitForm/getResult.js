import prependKey from 'app/helpers/misc/prependKey'
import checkEmptyObject from 'app/helpers/misc/checkEmptyObject'
import validate from './validate'

export default async function({form, itemId, data: rawData, viewer = null}) {
  const collection = await form.collectionDb().catch(err => {
    console.log('Cannot get collection from form', err.toString())
    throw new Error('A ocurrido un error')
  })

  const data = await validate({form, rawData, itemId, viewer}).catch(err => {
    console.log({
      message: 'An error ocurred validating the form data',
      form: form.name,
      err: err.toString()
    })
    if (err) {
      throw err
    } else {
      throw 'A ocurrido un error al validar los datos'
    }
  })

  if (form.type === 'create') {
    const newItemId = await collection.insert({data, createdAt: new Date()}).catch(err => {
      console.log('Could not create the new item in the collection', err.toString())
      throw new Error('A ocurrido un error al crear el nuevo registro')
    })
    return {_id: newItemId, data}
  } else if (form.type === 'update') {
    if (!itemId) {
      throw new Error('El identificador del registro a actualizar no se encuentra')
    }
    const item = await collection.findOne(itemId)
    if (!item) {
      throw new Error('El registro a actualizar no existe')
    }

    const $set = prependKey(data, 'data')
    const isEmpty = checkEmptyObject($set)
    if (isEmpty) return item

    await item.update({$set}).catch(err => {
      console.log('Error updating item with the new data', err.toString())
      throw new Error('A ocurrido un error al actualizar el registro')
    })
    const updatedItem = await collection.findOne(itemId).catch(err => {
      console.log('Could not find the updated item', err.toString())
      throw new Error('A ocurrido un error al recuperar el registro actualizado')
    })
    return updatedItem
  }
}
