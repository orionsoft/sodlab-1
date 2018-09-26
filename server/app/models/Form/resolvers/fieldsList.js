import {resolver} from '@orion-js/app'
import Field from 'app/models/Form/Field'

export default resolver({
  returns: [Field],
  async resolve(form, params, viewer) {
    return form.fields.filter(field => field.type === 'section' || field.type === 'editable')
  }
})
