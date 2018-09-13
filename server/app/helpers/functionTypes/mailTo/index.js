import Collections from 'app/collections/Collections'
import {spawn} from 'child_process'

async function mailto(recipients, fields, recipientsSeparator) {
  recipientsSeparator = recipientsSeparator || ','
  let url = 'mailto:' + recipients.join(recipientsSeparator)
  Object.keys(fields).map((key, index) => {
    if (index === 0) {
      url += '?'
    } else {
      url += '&'
    }
    url += key + '=' + encodeURIComponent(fields[key])
  })
  await open(url)
}

function open(url) {
  let command
  switch (process.platform) {
    case 'darwin':
      command = 'open'
      break
    case 'win32':
      command = 'explorer.exe'
      break
    case 'linux':
      command = 'xdg-open'
      break
    default:
      throw new Error('Plataforma no soportada: ' + process.platform)
  }
  return spawn(command, [url])
}

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

    return mailto([data[email]], {
      subject: `${data[name]}, Te presentamos Sodlab!`,
      body: content
    })
  }
}
