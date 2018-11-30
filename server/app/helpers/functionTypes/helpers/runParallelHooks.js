import Hooks from 'app/collections/Hooks'

async function runParallelHooks({hooksIds, params, userId}) {
  if (!hooksIds.length) return

  const hooks = await Hooks.find({_id: {$in: hooksIds}}).toArray()

  hooks.map(async function(hook) {
    try {
      return await hook.execute({params, userId})
    } catch (e) {
      console.log('Error running hook', e)
    }
  })

  await Promise.all(hooks)
}

export {runParallelHooks}
