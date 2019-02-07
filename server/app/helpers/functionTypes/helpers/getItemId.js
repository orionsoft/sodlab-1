export function getItemId({itemId, hooksData}) {
  // For backwards compatibility
  if (!itemId) {
    if (hooksData.currentHookNumber === 1) {
      return hooksData['0']._id
    }

    let {currentHookNumber} = hooksData
    let lastExecutedHook = currentHookNumber - 1

    while (lastExecutedHook >= 0) {
      if (!hooksData[`${lastExecutedHook}`].success && lastExecutedHook === 1) {
        return hooksData['0']._id
      } else if (!hooksData[`${lastExecutedHook}`].success) {
        lastExecutedHook--
      } else {
        return hooksData[`${lastExecutedHook}`].result._id
      }
    }
  }

  // This can only be achieved using a fixed value in the hook configuration
  // It matches if the itemId starts with a digit followed by a dot or a minus sign a digit and then a dot
  if (/(^\d+|^-\d+)\./.test(itemId)) {
    const itemIdParts = itemId.split('.')
    let hookResultNumber = itemIdParts[0]
    const param = itemIdParts[1]
    const {currentHookNumber} = hooksData

    if (/^-/.test(hookResultNumber)) {
      const substract = parseInt(hookResultNumber, 10)
      hookResultNumber = currentHookNumber + substract
      hookResultNumber = hookResultNumber < 0 ? '0' : hookResultNumber.toString()
    } else {
      hookResultNumber = parseInt(hookResultNumber, 10)
      hookResultNumber =
        hookResultNumber > currentHookNumber
          ? (currentHookNumber - 1).toString()
          : hookResultNumber.toString()
    }

    if (hookResultNumber === '0' || currentHookNumber === 0) return hooksData['0'][param]

    const _id =
      param === '_id'
        ? hooksData[hookResultNumber].result._id
        : hooksData[hookResultNumber].result.data[param]
    return _id
  }

  return itemId
}

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
