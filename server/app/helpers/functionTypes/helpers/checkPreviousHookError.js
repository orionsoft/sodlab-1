export function checkPreviousHookError({hooksData, shouldThrow}) {
  if (!shouldThrow) return hooksData

  const {currentHookNumber} = hooksData
  if (currentHookNumber === 0) return hooksData

  const lastHookNumber = (currentHookNumber - 1).toString()
  const lastHook = hooksData[lastHookNumber]

  if (!lastHook.success) throw new Error({customMsg: 'Last hook error: ' + lastHook.err})
}
