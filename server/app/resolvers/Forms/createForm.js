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
    collectionId: {
      type: 'ID',
      label: 'Colección'
    }
  },
  returns: Form,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name, title, collectionId}, viewer) {
    const formId = await Forms.insert({
      name,
      title,
      collectionId,
      environmentId,
      createdAt: new Date()
    })
    return await Forms.findOne(formId)
  }
})
