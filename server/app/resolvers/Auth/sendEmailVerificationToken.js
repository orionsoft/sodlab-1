import {sendEmail} from '@orion-js/mailing'

export default async function(user, token) {
  const url = `${process.env.CLIENT_URL}/verify-email/${token}`
  await sendEmail({
    to: await user.email(),
    subject: 'Verifica tu email',
    text: `Hola, para verificar tu email entra a esta página. ${url}`
  })
}
