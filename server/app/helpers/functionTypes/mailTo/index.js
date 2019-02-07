import {Files} from '@orion-js/file-manager'
import nodemailer from 'nodemailer'
import {getItemFromCollection, hookStart, throwHookError} from '../helpers'

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
    itemId: {
      type: String,
      label: '(opcional) Id del item. Por defecto se utilizará el ID del último documento',
      optional: true
    },
    from: {
      type: String,
      label: '(opcional) Nombre del remitente (Por default es "Sodlab")',
      optional: true,
      defaultValue: 'Sodlab'
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
  async execute({options, params, environmentId, hook, hooksData, viewer}) {
    const {
      collection,
      itemId,
      template,
      from,
      email,
      subject,
      cc,
      bcc,
      attachment,
      fileUrl
    } = options
    let data
    let content
    let file

    if (attachment) {
      file = await Files.findOne(attachment)
    }

    const {shouldThrow} = hook
    let item = {}

    try {
      item = await hookStart({
        shouldThrow,
        itemId,
        hooksData,
        collectionId: collection,
        hook,
        viewer
      })

      data = {...item.data, environmentId}
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
      return throwHookError(err)
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
      const err = 'No ENV VAR set to send emails'
      return throwHookError(err)
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
      from: `"${from}" <app@sodlab.com>`,
      to: data[email],
      subject,
      cc,
      bcc,
      attachments,
      html: content
    }

    try {
      await transporter.sendMail(mailOptions)
      return {start: item, result: item, success: true}
    } catch (err) {
      console.log(`Error when running mailTo from env: ${environmentId}`, err)
      return throwHookError(err)
    }
  }
}
