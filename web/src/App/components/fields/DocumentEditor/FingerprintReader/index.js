import React from "react"
import PropTypes from "prop-types"
import Modal from "react-modal"
import styles from "./styles.css"
import withFingerprint from "./withFingerprint"
import MdFingerprint from "react-icons/lib/md/fingerprint"
import TextSection from "../common/textSection"
import SignerName from "../common/signerName"
import SignerRut from "../common/signerRut"

class FingerprintModal extends React.Component {
  static propTypes = {
    addSignatureImage: PropTypes.func,
    handleSubmitImg: PropTypes.func,
    isFingerprintConnected: PropTypes.bool,
    isCaptured: PropTypes.bool,
    startFingerprint: PropTypes.func,
    stopFingerprintCapturing: PropTypes.func,
    renderToggleConnectedStatus: PropTypes.func,
    renderToggleHelpMessages: PropTypes.func,
    renderToggleButtonText: PropTypes.func
  }

  state = {
    modalIsOpen: false,
    placeholder: this.props.placeholder,
    who: "",
    why: "",
    rut: "",
    valid: false,
    checked: null
  }

  openModal = () => {
    this.setState({ modalIsOpen: true })
    this.props.startFingerprint()
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
    this.props.stopFingerprintCapturing()
  }

  handleWhoChange = who => this.setState({ who })

  handleWhyChange = why => this.setState({ why })

  handleRutChange = rut => this.setState({ rut })

  handleRutValidation = (valid, checked) => this.setState({ valid, checked })

  saveCapture = () => {
    this.props.addSignatureImage(
      `${this.state.rut}.fingerprint`,
      localStorage.getItem("fingerprintImgSrc"),
      this.state.who,
      this.state.rut,
      () => this.props.handleSubmitImg()
    )
    localStorage.removeItem("fingerprintImgSrc")
    this.props.stopFingerprintCapturing()
    this.closeModal()
  }

  cancelCapturing = () => {
    this.props.stopFingerprintCapturing()
    this.closeModal()
  }

  render() {
    return (
      <div>
        <Modal
          appElement={document.querySelector("#root")}
          isOpen={this.state.modalIsOpen}
          onClose={this.closeModal}
          className={styles.modal}
          overlayClassName={styles.overlay}
          contentLabel="Confirmación"
        >
          <div className={styles.contentContainer}>
            <TextSection
              containerStyle={styles.statusContainer}
              textStyle={styles.statusText}
              text={this.props.renderToggleConnectedStatus}
            />
            <TextSection
              containerStyle={styles.helpContainer}
              textStyle={styles.helpText}
              text={this.props.renderToggleHelpMessages}
            />
            <div id="fingerprintImg" className={styles.imageContainer}>
              <img
                id="fingerprintImage"
                alt=""
                src=""
                style={{ height: "300px", width: "auto" }}
              />
            </div>
            <div className={styles.personalInfoContainer}>
              <SignerName
                styles={styles}
                signerId={this.props.form.props.state.rut_cliente || ""}
                who={this.state.who}
                handleWhoChange={this.handleWhoChange}
              />
              <SignerRut
                styles={styles}
                signerId={this.props.form.props.state.rut_cliente || ""}
                rut={this.state.rut}
                handleRutChange={this.handleRutChange}
                handleRutValidation={this.handleRutValidation}
                checked={this.state.checked}
                valid={this.state.valid}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <input
                type="button"
                id="saveFingerprint"
                value="aceptar"
                disabled={
                  this.state.who !== "" &&
                  this.state.valid &&
                  this.props.isCaptured
                    ? false
                    : true
                }
                style={
                  this.state.who !== "" &&
                  this.state.valid &&
                  this.props.isCaptured
                    ? {
                        color: "#fff",
                        backgroundColor: "#2196f3"
                      }
                    : null
                }
                onClick={this.saveCapture}
              />
              <button id="cancelFingerprint" onClick={this.cancelCapturing}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
        <button onClick={this.openModal}>
          <MdFingerprint />
          CAPTURA DE HUELLA DIGITAL
        </button>
      </div>
    )
  }
}

export default withFingerprint(FingerprintModal)
