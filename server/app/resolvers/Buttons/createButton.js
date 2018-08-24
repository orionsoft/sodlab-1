import {resolver} from '@orion-js/app'
import Button from 'app/models/Button'
import Buttons from 'app/collections/Buttons'
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
      description: 'Solo puede haber un button con este nombre',
      async custom(name, {doc}) {
        const button = await Buttons.findOne({
          name: {$regex: `^${name}$`, $options: 'i'},
          environmentId: doc.environmentId
        })
        if (button) return 'notUnique'
      }
    },
    title: {
      type: String,
      label: 'Título'
    }
  },
  returns: Button,
  mutation: true,
  role: 'admin',
  async resolve({environmentId, name, title}, viewer) {
    const buttonId = await Buttons.insert({
      environmentId,
      name,
      title,
      createdAt: new Date()
    })
    return await Buttons.findOne(buttonId)
  }
})
