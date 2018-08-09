export default async function({form, item}) {
  const hooks = await form.hooks()
  const params = {_id: item._id, ...item.data}
  for (const hook of hooks) {
    try {
      await hook.execute({params, itemId: item._id})
    } catch (e) {
      console.log('Error running hook', e)
    }
  }
}
