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
  async execute({options, params}) {
    const {collectionId} = options
    const {_id} = params

    try {
      const collection = await Collections.findOne(collectionId)
      const db = await collection.db()
      const item = await db.findOne(_id)
      if (item) {
        await db.remove(_id)
      }
    } catch (error) {
      console.log(
        `Error when trying to remove item with ID ${_id} from collection with ID ${collectionId}, err:`,
        error
      )
    }
  }
}
