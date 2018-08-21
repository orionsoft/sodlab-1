import {resolver} from '@orion-js/app'
import Form from 'app/models/Form'
import Forms from 'app/collections/Forms'
import Environments from 'app/collections/Environments'

export default resolver({
  params: {
    environmentId: {
      type: 'ID',
      async custom(environmentId) {
        const env = await Environments.findOne(environmentId)
        if (!env) return 'notFound'
      }
    },
    name: {
      type: String,
      label: 'Nombre',
      description: 'Solo puede haber un formulario con este nombre',
      async custom(name, {doc}) {
        const form = await Forms.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: doc.environmentId
        })
        if (form) return 'notUnique'
      }
    },
    title: {
      type: String,
      label: 'Título'
    },
    type: {
      type: String,
      label: 'Tipo'
    },
    collectionId: {
      type: 'ID',
      label: 'Colección'
    },
    updateVariableName: {
      type: String,
      label: 'Nombre de la variable',
      optional: true,
      async custom(updateVariableName, {doc}) {
        if (doc.type === 'update' && !updateVariableName) return 'required'
      }
    }
  },
  returns: Form,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name, title, collectionId, type, updateVariableName}, viewer) {
    const formId = await Forms.insert({
      name,
      title,
      collectionId,
      environmentId,
      type,
      updateVariableName,
      createdAt: new Date()
    })
    return await Forms.findOne(formId)
  }
})
