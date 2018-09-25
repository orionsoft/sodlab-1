export default async function({form, item}) {
  const hooks = await form.hooks()
  if (!hooks.length) return

  try {
    let previousResult = null
    for (const hook of hooks) {
      const params = {_id: item._id, previousResult, ...item.data}
      previousResult = await hook.execute({params})
    }
  } catch (error) {
    console.log('Error running hook', error)
  }
}
