import Hooks from 'app/collections/Hooks'
import Promise from 'bluebird'

async function runSequentialHooks({
  hooksIds,
  params: initialParams,
  userId,
  shouldStopHooksOnError = false,
  environmentId
}) {
  if (!hooksIds || !hooksIds.length) return

  const hooks = await Hooks.find({_id: {$in: hooksIds}}).toArray()

  let params = {...initialParams}
  let hooksData = {
    currentHookNumber: 1,
    '0': {...initialParams}
  }
  const failedHooks = []
  await Promise.each(hooksIds, async function(hookId, index, length) {
    const hook = hooks.filter(h => h._id === hookId)[0]
    let hookResult = await hook.execute({params, userId, hooksData})

    if (!hookResult.success) {
      failedHooks.push({
        hookName: hook.name,
        err: hookResult.err.originalMsg ? hookResult.err.originalMsg : hookResult.err,
        hookPosition: `${hooksData.currentHookNumber} of ${hooks.length}`
      })

      // The option has to be added to the Form, Button and Table models
      if (shouldStopHooksOnError) {
        console.log({
          msg: 'Error: Force quiting sequential hooks',
          failedHooks,
          environmentId
        })
        throw hookResult.err
      }

      hooksData = {
        ...hooksData,
        [`${index + 1}`]: {
          start: hookResult.start,
          result: hookResult.start,
          success: hookResult.success,
          err: hookResult.err
        },
        currentHookNumber: index + 2
      }
    } else {
      params = {_id: hookResult.result._id, ...hookResult.result.data}
      hooksData = {
        ...hooksData,
        [`${index + 1}`]: {
          start: hookResult.start,
          result: hookResult.result,
          success: hookResult.success
        },
        currentHookNumber: index + 2
      }
    }

    // Log errors at the end of the chain if no forced errors were thrown
    if (index + 1 === length && failedHooks.length > 0) {
      console.log({
        msg: 'Error executing hooks',
        failedHooks,
        environmentId
      })
    }
  }).catch(err => {
    const error = {
      originalMsg: err.originalMsg || '',
      customMsg: err.customMsg || '',
      msg: 'Error executing hooks sequentially',
      failedHooks,
      environmentId,
      err
    }
    throw error
  })

  return {params, hooksData}
}

export {runSequentialHooks}

// Example of the hooksData object structure
// const hooksData = {
//   params: {_id, ...item.data},
//   currentHookNumber: 3,
//   0: { ...initialParams }, // the initial params received
//   1: {
//     start: {_id, data},
//     result: {_id, data},
//     success: true || false
//   },
//   2: {
//     start: {_id, data},
//     result: {_id, data},
//     success: true || false
//   }
// }
