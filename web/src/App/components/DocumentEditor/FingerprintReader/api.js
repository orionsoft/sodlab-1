export default class FingerprintAPI {
  constructor() {
    this.sdk = new window.Fingerprint.WebApi()
    this.sdk.onSamplesAcquired = s => this.samplesAcquired(s)
  }

  getDeviceList() {
    return this.sdk.enumerateDevices()
  }

  startCapture() {
    this.sdk.startAcquisition(window.Fingerprint.SampleFormat.PngImage).then(
      function() {
        return console.log('Capturando huella...')
      },
      function(error) {
        return console.log('Error al comenzar la captura de huella', error)
      }
    )
  }

  stopCapture() {
    this.sdk.stopAcquisition().then(
      function() {
        return console.log('Captura de huella detenida')
      },
      function(error) {
        return console.log('Error al detener la captura de huella...', error)
      }
    )
  }

  samplesAcquired(s) {
    localStorage.setItem('fingerprintImgSrc', '')
    const samples = JSON.parse(s.samples)
    localStorage.setItem(
      'fingerprintImgSrc',
      'data:image/png;base64,' + window.Fingerprint.b64UrlTo64(samples[0])
    )
    document.getElementById('fingerprintImage').src = localStorage.getItem('fingerprintImgSrc')
  }
}
