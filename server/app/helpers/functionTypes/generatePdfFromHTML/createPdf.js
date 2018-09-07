import puppeteer from 'puppeteer'

export default async function(content) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(`data:text/html,${content}`, {waitUntil: 'networkidle0'})
  const buffer = await page.pdf({
    format: 'Letter',
    margin: {top: 30, bottom: 30, left: 20, right: 20}
  })
  await browser.close()
  return buffer
}
