import Collections from 'app/collections/Collections'

export default {
  name: 'Borrar un documento',
  optionsSchema: {
    collectionId: {
      label: 'Collección',
      type: String,
      fieldType: 'collectionSelect'
    }
  },
  async execute({options, params, environmentId}) {
    const {collectionId} = options
    const {_id} = params
    let db
    let item

    try {
      const collection = await Collections.findOne(collectionId)
      db = await collection.db()
      item = await db.findOne(_id)
    } catch (err) {
      console.log(
        `Error finding item to delete from collection ${collectionId} in environment ${environmentId}`
      )
      return {success: false}
    }

    if (item) {
      try {
        await db.remove(_id)
        return {success: true}
      } catch (error) {
        console.log(
          `Error when trying to remove item with ID ${_id} from collection with ID ${collectionId} from env ${environmentId}, err:`,
          error
        )
        return {success: false}
      }
    }
  }
}
