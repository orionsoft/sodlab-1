export default async function({form, itemId}) {
  const hooks = await form.hooks()
  if (!hooks.length) return

  try {
    const collection = await form.collectionDb()
    let previousResult = null
    for (const hook of hooks) {
      const item = await collection.findOne(itemId)
      const params = {_id: item._id, previousResult, ...item.data}
      previousResult = await hook.execute({params, itemId: item._id})
    }
  } catch (error) {
    console.log('Error running hook', error)
  }
}
