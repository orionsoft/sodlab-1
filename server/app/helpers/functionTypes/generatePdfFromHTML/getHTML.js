const css = String.raw // para que formatee nomas

const styles = css`
  html,
  body {
    font-family: sans-serif;
    font-size: 11px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  th {
    text-align: left;
  }

  th,
  td {
    border-bottom: 1px solid #ddd;
  }

  tr:last-child td {
    border-bottom: none;
  }

  th,
  td {
    padding: 5px 0;
  }

  img {
    max-width: 100%;
  }
`
export default content => {
  return `<!DOCTYPE HTML>
<html>
<head>
  <meta charset="utf-8">
  <style>
${styles}
  </style>
</head>
  <body>
    ${content}
  </body>
</html>`
}
