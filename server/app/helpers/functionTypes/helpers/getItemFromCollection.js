import Collections from 'app/collections/Collections'

export async function getItemFromCollection({collectionId, itemId}) {
  const col = await Collections.findOne(collectionId)
  const db = await col.db()
  const item = await db.findOne(itemId)

  return item
}
