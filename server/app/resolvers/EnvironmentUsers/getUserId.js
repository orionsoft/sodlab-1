import Users from 'app/collections/Users'
import {generateId} from '@orion-js/app'
import {hashPassword} from '@orion-js/auth'
// import {sendEmail} from '@orion-js/mailing'

export default async function(email) {
  const user = await Users.findOne({'emails.address': email})
  if (user) return user._id

  const password = generateId()
    .slice(0, 8)
    .toLowerCase()

  const newUser = {
    emails: [
      {
        address: email,
        verified: true
      }
    ],
    services: {
      password: {
        bcrypt: hashPassword(password),
        createdAt: new Date()
      }
    },
    profile: {},
    createdAt: new Date()
  }
  const userId = await Users.insert(newUser)

  // await sendEmail({
  //   to: email,
  //   subject: 'Tu cuenta en sodlabx',
  //   text: `Te creamos una cuenta, debes entrar con tu email y tu contraseña es ${password}`
  // })

  return userId
}
