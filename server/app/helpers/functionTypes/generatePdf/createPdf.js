import pdf from 'html-pdf'

export default function(content, options) {
  return new Promise((resolve, reject) => {
    pdf.create(content, options).toBuffer((e, buff) => {
      if (e) {
        reject(e)
      } else {
        resolve(buff.toString('base64'))
      }
    })
  })
}
