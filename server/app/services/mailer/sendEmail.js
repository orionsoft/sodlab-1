import getTo from './getTo'
import transporter from './transporter'

export default async function(options) {
  const mailOptions = {
    from: '"Orionjs App" <app@orionjs.com>',
    ...options,
    to: await getTo(options)
  }
  const result = await transporter.sendMail(mailOptions)
  return result
}
