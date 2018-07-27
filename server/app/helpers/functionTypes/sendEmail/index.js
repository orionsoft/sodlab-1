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
  async execute(params) {
    console.log('sending email')
  }
}
