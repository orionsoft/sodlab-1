const css = String.raw // para que formatee nomas

export default (stylesheet, content) => {
  const userStyles = css`
    ${stylesheet}
  `
  const final = String.raw`<!DOCTYPE HTML>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      ${userStyles}
    </style>
  </head>
    <body>
      ${content}
    </body>
  </html>`

  return final
}
