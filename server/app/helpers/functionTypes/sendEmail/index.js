import {sendEmail} from '@orion-js/mailing'

export default {
  name: 'Enviar email',
  optionsSchema: {
    to: {
      type: 'email',
      label: 'Para (email)'
    },
    subject: {
      type: String,
      label: 'Asunto'
    },
    message: {
      type: String,
      label: 'Mensaje'
    }
  },
  async execute({options: {to, subject, message}, itemId, environmentId}) {
    try {
      await sendEmail({
        to,
        subject,
        text: message
      })
      return {success: true}
    } catch (err) {
      console.log(`Error executing hook sendMail to ${to} from env ${environmentId}`)
      return {success: false}
    }
  }
}
