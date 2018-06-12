import nodemailer from 'nodemailer'

export default nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
    user: 'rkztwquzxcf74hj7@ethereal.email',
    pass: 'WHtfFa7JuwvxZ7BwvY'
  }
})
