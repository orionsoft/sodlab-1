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
  async execute({options, params, environmentId}) {
    const {template, email, name} = options
    let data
    let content

    try {
      const collection = await Collections.findOne(options.collection)
      const collectionDB = await collection.db()
      const item = await collectionDB.findOne(params._id)
      if (!item) return

      data = item.data
      content = template
      Object.keys(data).forEach(variable => {
        const regexp = new RegExp(`{${escape(variable)}}`, 'g')
        content = content.replace(regexp, data[variable])
      })
    } catch (err) {
      console.log(
        `Error when trying to find the document with id ${params._id} from the collection ${
          options.collection
        } from env: ${environmentId}`,
        err
      )
      return {success: false}
    }

    try {
      await sendEmail({
        to: data[email],
        subject: `${data[name]}, Te presentamos Sodlab!`,
        html: content
      })
      return {success: true}
    } catch (err) {
      console.log(`Error when running mailTo from env: ${environmentId}`, err)
      return {success: false}
    }
  }
}
