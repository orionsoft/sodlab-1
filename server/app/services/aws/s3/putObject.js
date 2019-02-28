import {s3} from 'app/services/aws'

export function putObject(params) {
  return new Promise((resolve, reject) => {
    s3.putObject(params, function(err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}
