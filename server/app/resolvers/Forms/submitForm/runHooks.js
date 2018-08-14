export default async function({form, item}) {
  const hooks = await form.hooks()
  let previousResult = null
  try {
    for (const hook of hooks) {
      const params = {_id: item._id, previousResult, ...item.data}
      previousResult = await hook.execute({params, itemId: item._id})
    }
  } catch (error) {
    console.log('Error running hook', error)
  }
}
