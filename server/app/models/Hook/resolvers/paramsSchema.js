import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  async resolve(hook, params, viewer) {
    await hook.execute({params: {email: 'nicolaslopezj@me.com'}})
  }
})
