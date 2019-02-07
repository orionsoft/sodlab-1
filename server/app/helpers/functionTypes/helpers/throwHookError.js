export function throwHookError(err) {
  if (typeof err === 'object') {
    if (Object.keys(err).includes('originalMsg')) {
      console.log('@@@ throwing an object err')
      return {err, success: false}
    }
    console.log('@@@ throwing a modified object err')
    return {err: {originalMsg: err.toString()}, success: false}
  }
  console.log('throwing an string error')
  return {err: {originalMsg: err.toString()}, success: false}
}
