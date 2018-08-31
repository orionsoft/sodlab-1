export default class FingerprintAPI {
  constructor(sampleFormat, wsqId) {
    this.sampleFormat = sampleFormat
    this.wsqId = wsqId
    this.formatOptions = {
      raw: 1,
      intermediate: 2,
      compressed: 3,
      pngImage: 5
    }
    this.sdk = new window.Fingerprint.WebApi()
    this.sdk.onSamplesAcquired = s => this.samplesAcquired(s)
  }

  getDeviceList() {
    return this.sdk.enumerateDevices()
  }

  startCapture() {
    this.sdk.startAcquisition(this.formatOptions[this.sampleFormat]).then(
      function() {
        return 'Capturando huella...'
      },
      function(error) {
        return 'Error al comenzar la captura de huella'
      }
    )
  }

  stopCapture() {
    this.sdk.stopAcquisition().then(
      function() {
        return 'Captura de huella detenida'
      },
      function(error) {
        return 'Error al detener la captura de huella...'
      }
    )
  }

  samplesAcquired(s) {
    const selection = this.formatOptions[this.sampleFormat]
    if (selection === window.Fingerprint.SampleFormat.PngImage) {
      localStorage.setItem('fingerprintPng', '')
      const samples = JSON.parse(s.samples)
      localStorage.setItem(
        'fingerprintPng',
        'data:image/png;base64,' + window.Fingerprint.b64UrlTo64(samples[0])
      )
      document.getElementById('fingerprintImage').src = localStorage.getItem('fingerprintPng')
    } else if (selection === window.Fingerprint.SampleFormat.Compressed) {
      if (localStorage.getItem(this.wsqId) !== null) {
        localStorage.removeItem(this.wsqId)
      }
      localStorage.setItem(this.wsqId, '')
      const samples = JSON.parse(s.samples)
      const sampleData = window.Fingerprint.b64UrlTo64(samples[0].Data)
      const decodedData = JSON.parse(window.Fingerprint.b64UrlToUtf8(sampleData))
      localStorage.setItem(
        this.wsqId,
        'data:application/octet-stream;base64,' + window.Fingerprint.b64UrlTo64(decodedData.Data)
      )
    }
  }
}
