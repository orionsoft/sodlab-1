import {checkPreviousHookError, getItemFromCollection, getItemId, runValidations} from '../helpers'

export async function hookStart({shouldThrow, itemId, hooksData, collectionId, hook, viewer}) {
  try {
    checkPreviousHookError({hooksData, shouldThrow})
  } catch (err) {
    throw err
  }

  let _id = ''
  try {
    _id = getItemId({itemId, hooksData})
  } catch (err) {
    console.log(`Could not get the Item ID for the hook ${hook.name}`, err)
    throw new Error({customMsg: `Could not get the Item ID for the hook ${hook.name}`})
  }

  const item = await getItemFromCollection({collectionId, itemId: _id}).catch(err => {
    console.log(
      `Could not get the Item ${_id} from the collection ${collectionId} for the hook ${hook.name}`,
      err
    )
    throw new Error({
      customMsg: `Could not get the Item ${_id} from the collection ${collectionId} for the hook ${
        hook.name
      }`
    })
  })

  const params = {_id: item._id, ...item.data}
  await runValidations({hook, params, viewer}).catch(err => {
    throw err
  })

  return item
}
