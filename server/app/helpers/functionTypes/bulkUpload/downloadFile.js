import AWS from 'aws-sdk'

export default function(bucket, key) {
  AWS.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
  })

  const s3 = new AWS.S3({apiVersion: '2006-03-01'})

  const options = {
    Bucket: bucket,
    Key: key
  }

  return new Promise((resolve, reject) => {
    const file = s3.getObject(options).createReadStream()

    let buffers = []

    file.on('error', error => reject(error))

    file.on('data', data => buffers.push(data))

    file.on('end', () => {
      const buffer = Buffer.concat(buffers)

      return resolve(buffer)
    })
  })
}
