const isProduction = window.location.hostname.includes('sodlab')

const apiUrl = isProduction ? 'https://api.sodlab-document-editor.com' : 'http://localhost:8000'

export default 'http://192.168.2.153:8000'
