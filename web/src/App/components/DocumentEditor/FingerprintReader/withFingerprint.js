import React from 'react'
import FingerprintAPI from './api'

function withFingerprint(Component) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        Fingerprint: {},
        isFingerprintConnected: false,
        // !! remove isCaptured in favor of isPngCaptured and isWsqCaptured
        isCaptured: false,
        isPngCaptured: false,
        isWsqCaptured: false,
        timer: null
      }
    }

    resetState = () => {
      this.setState({
        Fingerprint: {},
        isFingerprintConnected: false,
        isCaptured: false,
        isPngCaptured: false,
        isWsqCaptured: false,
        timer: null
      })
    }

    startCapturing = (sampleType, wsqId) => {
      this.state.Fingerprint.startCapture()

      this.setState({
        timer: setInterval(() => {
          if (!this.state[sampleType]) {
            this.checkLocalStorage(sampleType, wsqId)
          } else {
            this.state.Fingerprint.stopCapture()
          }
        }, 500)
      })
    }

    checkLocalStorage = (sampleType, key) => {
      if (sampleType === 'isPngCaptured') {
        if (localStorage.getItem('fingerprintPng') !== null) this.setState({ isPngCaptured: true })
      } else {
        if (localStorage.getItem(key) !== null) this.setState({ isWsqCaptured: true })
      }
    }

    startFingerprint = (format, wsqId) => {
      const Fingerprint = new FingerprintAPI(format, wsqId)
      this.setState({ Fingerprint }, () => {
        this.state.Fingerprint.getDeviceList()
          .then(devices => {
            this.setState({ isFingerprintConnected: true })
            const sampleType = format === 'pngImage' ? 'isPngCaptured' : 'isWsqCaptured'
            this.startCapturing(sampleType, wsqId)
          })
          .catch(error => this.setState({ isFingerprintConnected: false }))
      })
    }

    stopFingerprintCapturing = () => {
      this.state.Fingerprint.stopCapture()
      clearInterval(this.state.timer)

      this.setState({
        Fingerprint: {},
        // isCaptured: false,
        // isPngCaptured: false,
        // isWsqCaptured: false,
        timer: null
      })
    }

    toggleFingerprintCapture = () => {
      if (this.state.isFingerprintConnected) {
        this.stopFingerprintCapturing()
      } else {
        this.startFingerprint()
      }
    }

    renderToggleConnectedStatus = () => {
      if (this.state.isFingerprintConnected) {
        return 'Capturando huella...'
      } else {
        return 'Lector de Huella Digital'
      }
    }

    renderToggleHelpMessages = () => {
      const { isFingerprintConnected } = this.state
      const imageSrc = localStorage.getItem('fingerprintPng')
      if (isFingerprintConnected === false) {
        return 'Presione el botón INICIAR CAPTURA para comenzar la captura de huella'
      } else if (isFingerprintConnected && imageSrc === null) {
        return 'Posicione el dedo en el huellero para comenzar la captura'
      } else if (imageSrc !== null && imageSrc !== '') {
        return 'Huella capturada'
      }
    }

    renderToggleButtonText = () => {
      if (this.state.isFingerprintConnected) {
        return 'Detener Captura de Huella'
      } else {
        return 'Iniciar Captura de Huella'
      }
    }

    render() {
      return (
        <Component
          isFingerprintConnected={this.state.isFingerprintConnected}
          isPngCaptured={this.state.isPngCaptured}
          isWsqCaptured={this.state.isWsqCaptured}
          startFingerprint={this.startFingerprint}
          stopFingerprintCapturing={this.stopFingerprintCapturing}
          toggleFingerprintCapture={this.toggleFingerprintCapture}
          renderToggleConnectedStatus={this.renderToggleConnectedStatus}
          renderToggleHelpMessages={this.renderToggleHelpMessages}
          renderToggleButtonText={this.renderToggleButtonText}
          {...this.props}
        />
      )
    }
  }
}

export default withFingerprint
