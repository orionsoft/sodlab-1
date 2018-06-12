import sendEmail from 'app/services/mailer/sendEmail'

export default async function(user, token) {
  const url = `http://localhost:3010/reset/${token}`
  await sendEmail({
    address: await user.email(),
    subject: 'Recuperación de contraseña',
    text: `Hola, para crear una nueva contraseña entra a esta página. ${url}`
  })
}
