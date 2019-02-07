import pdf from 'html-pdf'

export default async function(content, userOptions) {
  let options = {}
  try {
    options = JSON.parse(userOptions)
  } catch (err) {
    options = {format: 'Letter', border: {top: '20px', bottom: '20px', left: '20px', right: '20px'}}
  }

  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      // save to disk for faster testing in a local environment
      pdf.create(content, options).toFile('./test.pdf', (e, res) => {
        if (e) {
          reject(e)
        } else {
          resolve(res)
        }
      })
    } else {
      pdf.create(content, options).toBuffer((e, buff) => {
        if (e) {
          reject(e)
        } else {
          resolve(buff)
        }
      })
    }
  })
}
