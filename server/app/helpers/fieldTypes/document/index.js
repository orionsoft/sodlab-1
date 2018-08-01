import {File} from '@orion-js/file-manager'

export default {
  name: 'Documento',
  rootType: 'blackbox',
  allowedOperatorsIds: ['exists'],
  optional: false,
  optionsSchema: {
    collectionId: {
      label: 'Collección de Clientes',
      type: String,
      fieldType: 'collectionSelect'
    },
    valueKey: {
      type: String,
      label: 'Campo RUT',
      fieldType: 'collectionFieldSelect'
    },
    labelKey: {
      type: String,
      label: 'Campo de título',
      fieldType: 'collectionFieldSelect'
    }
  },
  _clean: File._clean,
  autoValue: async function(value) {
    return await File._clean(value)
  }
}
