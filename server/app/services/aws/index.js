import AWS from 'aws-sdk'

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
})

const s3 = new AWS.S3({apiVersion: '2006-03-01'})

export {s3}
