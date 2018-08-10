import {File} from '@orion-js/file-manager'
import isUndefined from 'lodash/isUndefined'

export default {
  name: 'Archivo',
  rootType: 'blackbox',
  allowedOperatorsIds: ['exists'],
  optional: false,
  optionsSchema: null,
  _clean: File._clean,
  autoValue: async function(value) {
    if (!isUndefined(value)) {
      return await File._clean(value)
    }
  }
}
