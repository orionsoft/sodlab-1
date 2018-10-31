import AWS from 'aws-sdk'
import moment from 'moment'

AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION
})

const cw = new AWS.CloudWatchLogs({apiVersion: '2015-01-28'})

function putLogEvents(logs) {
  return new Promise((resolve, reject) => {
    logs.date = moment().format('MMMM Do YYYY, h:mm:ss a')
    logs.timestamp = new Date()

    const params = {
      logEvents: [
        {
          message: JSON.stringify(logs),
          timestamp: new Date().getTime()
        }
      ],
      logGroupName: 'sodlab-server-beta' /* required */,
      logStreamName: 'stream-beta' /* required */,
      sequenceToken: '49589209649865196863666493981595173099574313729680114914'
    }

    cw.putLogEvents(params, (err, data) => {
      if (err) {
        console.log('Error:', err)
        reject(err)
      } else {
        console.log('Data:', data)
        resolve(data)
      }
    })
  })
}

export {putLogEvents}
