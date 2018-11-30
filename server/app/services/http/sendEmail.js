import {route} from '@orion-js/app'
import nodemailer from 'nodemailer'

route('/sodlab/sendEmail', async function({getBody}) {
  const body = await getBody()
  const parsedBody = JSON.parse(body)

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

  const mailOptions = {
    from: '"Sodlab App" <app@sodlab.com>',
    to: 'cristian.ojeda@sodlab.com',
    cc: 'jorge.diaz@sodlab.com',
    subject: 'Contacto de la página Sodlab.com',
    html: `
    <p>Nombre Contacto: ${parsedBody.name}</p>
    <p>Email Contacto: ${parsedBody.email}</p>
    <p>Mensaje: ${parsedBody.message}</p>`
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
})
