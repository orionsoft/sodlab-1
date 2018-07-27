import {File} from '@orion-js/file-manager'

export default {
  name: 'Archivo',
  rootType: 'blackbox',
  allowedOperatorsIds: ['exists'],
  optional: false,
  optionsSchema: null,
  _clean: File._clean,
  autoValue: async function(value) {
    return await File._clean(value)
  }
}
