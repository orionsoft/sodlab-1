import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    }
  },
  returns: Boolean,
  mutation: true,
  private: true,
  async resolve(hook, {params}, viewer) {
    const functionType = await hook.functionType()
    const options = await hook.getOptions({params})
    return await functionType.executeFunction({options})
  }
})
