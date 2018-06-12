import {route} from '@orion-js/app'
import sendEmail from 'app/services/mailer/sendEmail'

route('/', async function() {
  await sendEmail({
    addresses: ['anemail@me.com', 'a2email@me.com'],
    subject: 'testing',
    text: 'Hello this is a text'
  })
  return 'hi'
})
