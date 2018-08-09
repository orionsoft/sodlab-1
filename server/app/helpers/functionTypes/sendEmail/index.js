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
  async execute({options: {to, subject, message}, itemId}) {
    await sendEmail({
      to,
      subject,
      text: message
    })
  }
}
