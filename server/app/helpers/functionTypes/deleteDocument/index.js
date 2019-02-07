import {hookStart, throwHookError} from '../helpers'

export default {
  name: 'Borrar un documento',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    },
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    }
  },
  async execute({options, environmentId, hook, hooksData, viewer}) {
    const {collectionId, itemId} = options
    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer})
    } catch (err) {
      console.log(
        `Error finding item to delete from collection ${collectionId} in environment ${environmentId}`,
        err
      )
      return throwHookError(err)
    }

    if (item) {
      try {
        await item.remove()
        return {start: item, result: item, success: true}
      } catch (err) {
        console.log(
          `Error when trying to remove item with ID ${
            item._id
          } from collection with ID ${collectionId} from env ${environmentId}, err:`,
          err
        )
        return throwHookError(err)
      }
    }
  }
}
