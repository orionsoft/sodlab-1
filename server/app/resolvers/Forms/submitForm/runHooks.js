import {runSequentialHooks} from 'app/helpers/functionTypes/helpers'

export default async function({form, item, userId, viewer = null}) {
  const {shouldStopHooksOnError, environmentId} = form
  const hooks = await form.hooks()
  if (!hooks.length) return
  const hooksIds = hooks.map(hook => hook._id)

  const params = {_id: item._id, ...item.data}

  const result = await runSequentialHooks(
    {hooksIds, params, userId, shouldStopHooksOnError, environmentId},
    viewer
  ).catch(err => {
    const error = {
      ...err,
      formName: form.name
    }
    console.log(error)

    if (!shouldStopHooksOnError) return
    throw err.originalMsg
  })

  return result
}
