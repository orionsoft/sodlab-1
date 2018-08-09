import {resolvers} from '@orion-js/file-manager'
import FormData from 'form-data'
import fetch from 'unfetch'
import rp from 'request-promise'
import fs from 'fs'
import AWS from 'aws-sdk'

export default async function uploadPDF(dte, tipoDoc) {
  let file = Buffer.from(dte.pdf, 'base64')
  let fileSize = Buffer.byteLength(dte.pdf, 'base64')

  const credentials = await resolvers.generateUploadCredentials({
    name: dte.id,
    type: 'application/pdf',
    size: fileSize
  })

  console.log({credentials})

  // let data = {
  //   ...credentials.fields,
  //   key: credentials.key,
  //   file: {
  //     value: file,
  //     contentType: 'application/pdf'
  //   }
  // }
  // console.log({data})
  //
  // await rp({
  //   method: 'POST',
  //   uri: credentials.url,
  //   formData: JSON.stringify(data)
  // })
  ////
  // var formData = new FormData()
  // const data = {
  //   ...credentials.fields,
  //   key: credentials.key,
  //   file: file
  // }
  //
  // for (const name in data) {
  //   formData.append(name, data[name])
  // }
  //
  // await fetch(credentials.url, {
  //   method: 'POST',
  //   // body: formData
  //   body: JSON.stringify(data)
  // })
  //   .then(res => {
  //     return res.json()
  //   })
  //   .catch(error => {
  //     console.log('Error: ', error)
  //   })
  //   .then(response => {
  //     console.log('Success: ', response)
  //     return response
  //   })

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
  console.log({uploadData})

  console.log('enviado')

  const completeUpload = await resolvers.completeUpload({
    fileId: credentials.fileId
  })

  return completeUpload
}
