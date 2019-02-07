export async function getCollection(collectionName, environmentId) {
  const collectionId = `${environmentId}_${collectionName}`
  const col = await Collections.findOne(collectionId)
  const db = await col.db()
  return {[collectionName]: db}
}
