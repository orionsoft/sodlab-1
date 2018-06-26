import {resolver} from '@orion-js/app'

export default resolver({
  returns: 'blackbox',
  private: true,
  async resolve(field, params, viewer) {
    console.log(field)
    const fieldType = await field.fieldType()
    return {
      type: fieldType.rootType,
      label: field.label,
      fieldType: field.type,
      fieldOptions: field.options
    }
  }
})
