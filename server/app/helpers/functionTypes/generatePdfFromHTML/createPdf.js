import pdf from 'html-pdf'

export default async function(content) {
  const options = {
    format: 'Letter',
    border: {top: '20px', bottom: '20px', left: '20px', right: '20px'}
  }
  return new Promise((resolve, reject) => {
    pdf.create(content, options).toBuffer((e, buff) => {
      if (e) {
        reject(e)
      } else {
        resolve(buff)
      }
    })
  })
}
