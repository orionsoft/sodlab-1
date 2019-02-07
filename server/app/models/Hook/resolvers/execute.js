import {resolver} from '@orion-js/app'

export default resolver({
  params: {
    params: {
      type: 'blackbox'
    },
    userId: {
      type: 'ID'
    },
    hooksData: {
      type: 'blackbox',
      optional: true
    },
    view: {
      type: String,
      optional: true
    }
  },
  returns: Boolean,
  mutation: true,
  private: true,
  async resolve(hook, {params, userId, hooksData, view}, viewer) {
    const {environmentId} = hook
    const functionType = await hook.functionType()
    const options = await hook.getOptions({params})
    return await functionType.executeFunction({
      options,
      params,
      environmentId,
      userId,
      view,
      hook,
      hooksData
    })
  }
})
