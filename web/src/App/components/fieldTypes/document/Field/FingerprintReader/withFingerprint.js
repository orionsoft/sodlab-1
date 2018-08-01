import React from "react"
import FingerprintAPI from "./api"

function withFingerprint(Component) {
  return class extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        Fingerprint: {},
        isFingerprintConnected: false,
        isCaptured: false,
        timer: {}
      }
    }

    resetState = () => {
      this.setState({
        Fingerprint: {},
        isFingerprintConnected: false,
        isCaptured: false,
        timer: {}
      })
    }

    startCapturing = () => {
      this.state.Fingerprint.startCapture()
      this.setState({
        timer: setInterval(() => {
          this.checkLocalStorage()
        }, 500)
      })
    }

    checkLocalStorage = () => {
      if (localStorage.getItem("fingerprintImgSrc") !== null)
        this.setState({ isCaptured: true })
    }

    startFingerprint = () => {
      const Fingerprint = new FingerprintAPI()
      this.setState({ Fingerprint }, () => {
        this.state.Fingerprint.getDeviceList()
          .then(devices => {
            this.setState({ isFingerprintConnected: true })
            this.startCapturing()
          })
          .catch(error => this.setState({ isFingerprintConnected: false }))
      })
    }

    stopFingerprintCapturing = () => {
      this.state.Fingerprint.stopCapture()
      localStorage.removeItem("fingerprintImgSrc")
      clearInterval(this.state.timer)
      this.setState({
        isCaptured: false,
        timer: {}
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
        return "Capturando huella..."
      } else {
        return "Lector de Huella Digital"
      }
    }

    renderToggleHelpMessages = () => {
      const { isFingerprintConnected } = this.state
      const imageSrc = localStorage.getItem("fingerprintImgSrc")
      if (isFingerprintConnected === false) {
        return "Presione el botón INICIAR CAPTURA para comenzar la captura de huella"
      } else if (isFingerprintConnected && imageSrc === null) {
        return "Posicione el dedo en el huellero para comenzar la captura"
      } else if (imageSrc !== null && imageSrc !== "") {
        return "Huella capturada"
      }
    }

    renderToggleButtonText = () => {
      if (this.state.isFingerprintConnected) {
        return "Detener Captura de Huella"
      } else {
        return "Iniciar Captura de Huella"
      }
    }

    render() {
      return (
        <Component
          isFingerprintConnected={this.state.isFingerprintConnected}
          isCaptured={this.state.isCaptured}
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
