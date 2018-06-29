import {resolver} from '@orion-js/app'

export default resolver({
  returns: [String],
  async resolve(view, params, viewer) {
    console.log(view)
    if (!view.path) return []
    const parts = view.path
      .split('/')
      .filter(part => {
        return part.startsWith(':')
      })
      .map(part => {
        return part.replace(':', '')
      })
    console.log(parts)
    return parts
  }
})
