import Hooks from 'app/collections/Hooks'
import Promise from 'bluebird'

async function runSequentialHooks({hooksIds, params, userId}) {
  if (!hooksIds.length) return

  const hooks = await Hooks.find({_id: {$in: hooksIds}}).toArray()

  try {
    await Promise.each(hooks, async function(hook) {
      try {
        await hook.execute({params, userId})
      } catch (err) {
        console.log(
          `Error trying to execute sequentially the hook: ${hook.name} from env ${
            hook.environmentId
          }, err:`,
          err
        )
      }

      return
    })
  } catch (err) {
    console.log(`Error executing sequential hooks in ${environmentId}`, err)
  }
}

export {runSequentialHooks}
