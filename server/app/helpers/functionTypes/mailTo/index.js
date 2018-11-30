import Collections from 'app/collections/Collections'
import {Files} from '@orion-js/file-manager'
import nodemailer from 'nodemailer'

function parseFileUrl(file) {
  const types = ['.png', 'jpg', '.xlsx', '.xls', '.pdf']
  if (!file) {
    throw new Error('No hay archivo adjuntado')
  }

  if (typeof file === 'object') {
    return {
      filename: file.key,
      path: `https://s3.amazonaws.com/${file.bucket}/${file.key}`
    }
  } else {
    const output = types
      .map(type => {
        if (file.includes(type)) {
          return {
            filename: `archivo${type}`,
            path: file
          }
        }
      })
      .filter(attachment => attachment)
      .reduce((acc, value) => {
        acc['filename'] = value.filename
        acc['path'] = value.path
        return acc
      }, {})

    return output
  }
}

export default {
  name: 'Enviar Email',
  optionsSchema: {
    collection: {
      type: String,
      label: 'Colección de los datos',
      fieldType: 'collectionSelect'
    },
    email: {
      type: String,
      label: 'Email del destinatario',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collection'
    },
    subject: {
      type: String,
      label: 'Asunto del email'
    },
    fileUrl: {
      type: String,
      label: 'Archivo adjuntar desde la tabla',
      fieldType: 'collectionFieldSelect',
      parentCollection: 'collection',
      optional: true
    },
    cc: {
      type: String,
      label: 'Con copia (Opcional) (emails separados con coma) ',
      optional: true
    },
    bcc: {
      type: String,
      label: 'Con copia oculta (Opcional) (emails separados con coma) ',
      optional: true
    },
    attachment: {
      type: 'blackbox',
      fieldType: 'file',
      label: 'Archivo adjuntar (Opcional)',
      optional: true
    },
    template: {
      type: String,
      label: 'Template a usar'
    }
  },
  async execute({options, params, environmentId}) {
    const {template, email, subject, cc, bcc, attachment, fileUrl} = options
    let data
    let content
    let file

    if (attachment) {
      file = await Files.findOne(attachment)
    }

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

    const mailURL = process.env.MAIL_URL

    let transporter = null

    if (mailURL) {
      transporter = nodemailer.createTransport(mailURL)
      transporter.verify(function(error, success) {
        if (error) {
          console.log('Error connecting to SMTP:', error)
        }
      })
    } else {
      throw new Error('No environment variable for the configuration')
    }

    let attachments = []

    if (fileUrl) {
      attachments.push(parseFileUrl(data[fileUrl]))
    }

    if (file) {
      attachments.push({
        filename: file.key,
        path: `https://s3.amazonaws.com/${file.bucket}/${file.key}`
      })
    }

    const mailOptions = {
      from: '"Sodlab App" <app@sodlab.com>',
      to: data[email],
      subject,
      cc,
      bcc,
      attachments,
      html: content
    }

    try {
      await transporter.sendMail(mailOptions)
      return {
        success: true
      }
    } catch (err) {
      console.log(`Error when running mailTo from env: ${environmentId}`, err)
      return {
        success: false
      }
    }
  }
}
