import {resolvers} from '@orion-js/file-manager'
import AWS from 'aws-sdk'

export default async function uploadPDF(dte, tipoDoc) {
  let file = Buffer.from(dte.pdf, 'base64')
  let fileSize = Buffer.byteLength(dte.pdf, 'base64')

  const credentials = await resolvers.generateUploadCredentials({
    name: dte.id,
    type: 'application/pdf',
    size: fileSize
  })

  AWS.config.update({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
    region: process.env.AWS_S3_REGION
  })

  const s3 = new AWS.S3({apiVersion: '2006-03-01'})
  let params = {
    Body: file,
    Bucket: credentials.fields.bucket,
    Key: credentials.key,
    ContentType: 'application/pdf',
    ContentEncoding: 'base64'
  }

  const uploadData = await s3.putObject(params, function(err, data) {
    if (err) console.log(err)
    else console.log(data)
  })

  const completeUpload = await resolvers.completeUpload({
    fileId: credentials.fileId
  })

  return completeUpload
}
