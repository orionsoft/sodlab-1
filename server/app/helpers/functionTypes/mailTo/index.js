import Collections from 'app/collections/Collections'
import {sendEmail} from '@orion-js/mailing'

export default {
  name: 'mail To',
  optionsSchema: {
    collection: {
      type: String,
      label: 'Colección de los datos',
      fieldType: 'collectionSelect'
    },
    name: {
      type: String,
      label: 'Nombre del destinatario',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collection'
    },
    email: {
      type: String,
      label: 'Email del destinatario',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collection'
    },
    template: {
      type: String,
      label: 'Template a usar'
    }
  },
  async execute({options, params}) {
    const collection = await Collections.findOne(options.collection)
    const collectionDB = await collection.db()
    const {data} = await collectionDB.findOne(params._id)
    if (!data) return

    const {template, email, name} = options
    let content = template
    Object.keys(data).forEach(variable => {
      const regexp = new RegExp(`{${escape(variable)}}`, 'g')
      content = content.replace(regexp, data[variable])
    })

    await sendEmail({
      to: data[email],
      subject: `${data[name]}, Te presentamos Sodlab!`,
      html: content
    })
  }
}
