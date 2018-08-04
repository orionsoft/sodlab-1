import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import styles from './styles.css'
import withFingerprint from '../FingerprintReader/withFingerprint'
import withSignature from '../SignatureCapture/withSignature'
import MdFingerprint from 'react-icons/lib/md/fingerprint'
import MdSignature from 'react-icons/lib/md/border-color.js'
import TextSection from '../common/textSection'
import SignerName from '../common/signerName'
import SignerRut from '../common/signerRut'
import SignerReason from '../common/signerReason'

class FingerprintAndSignature extends React.Component {
  static propTypes = {
    collectionId: PropTypes.string,
    client: PropTypes.object,
    startFingerprint: PropTypes.func,
    stopFingerprintCapturing: PropTypes.func,
    handleWhoChange: PropTypes.func,
    handleWhyChange: PropTypes.func,
    startCapture: PropTypes.func,
    form: PropTypes.object,
    addFingerprintOrPenSignature: PropTypes.func,
    handleSubmitImg: PropTypes.func,
    renderToggleConnectedStatus: PropTypes.string,
    renderToggleHelpMessages: PropTypes.string,
    signatureState: PropTypes.object,
    handleSubmitSignature: PropTypes.func,
    isCaptured: PropTypes.bool
  }

  state = {
    modalIsOpen: false,
    who: '',
    why: '',
    rut: '',
    addFingerprintOrPenSignature: PropTypes.func,
    handleSubmitImg: PropTypes.func
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
    this.props.startFingerprint()
  }

  closeModal = () => {
    this.setState({modalIsOpen: false})
    this.props.stopFingerprintCapturing()
  }

  handleWhoChange = who => this.props.handleWhoChange(who, () => this.setState({who}))

  handleWhyChange = why => this.props.handleWhyChange(why, () => this.setState({why}))

  handleRutChange = rut => this.setState({rut})

  handleRutValidation = (valid, checked) => this.setState({valid, checked})

  startSignatureCapture = () => {
    this.props.startCapture()
  }

  saveCapture = () => {
    this.props.handleSubmitSignature(this.state.rut, this.state.who)
    this.closeModal()
  }

  saveCapture = () => {
    const penSignatureImg = document.getElementById('signatureImageBox').firstChild
    if (penSignatureImg.src === null || penSignatureImg.src === '') return
    const penSignatureImgSrc = penSignatureImg.src

    const fingerprint = document.getElementById('fingerprintImage')
    if (fingerprint.src === null || fingerprint.src === '') return
    const fingerprintImgSrc = fingerprint.src

    this.props.addFingerprintOrPenSignature(
      'fingerprint',
      `${this.state.rut}.fingerprint`,
      fingerprintImgSrc,
      this.state.who,
      this.state.rut,
      () => {
        this.props.addFingerprintOrPenSignature(
          'pen signature',
          `${this.state.rut}.signature`,
          penSignatureImgSrc,
          this.state.who,
          this.state.rut,
          () => {
            this.props.handleSubmitImg()
          }
        )
      }
    )
  }

  render() {
    if (!this.props.client) return null
    return (
      <div>
        <Modal
          appElement={document.querySelector('#root')}
          isOpen={this.state.modalIsOpen}
          onClose={this.closeModal}
          className={styles.modal}
          overlayClassName={styles.overlay}
          contentLabel="Confirmación">
          <div className={styles.contentContainer}>
            <div className={styles.deviceContainer}>
              <div className={styles.imageContainer}>
                <TextSection
                  containerStyle={styles.statusContainer}
                  textStyle={styles.statusText}
                  staticText={'Captura de Firma'}
                />
                <TextSection
                  containerStyle={styles.helpContainer}
                  textStyle={styles.helpText}
                  staticText={this.props.signatureState.helpText}
                />
                <div id="signatureImageBox" className={styles.signatureImageBox} />
                <button
                  id="startSignatureCapture"
                  className={styles.startCapture}
                  onClick={this.startSignatureCapture}>
                  Iniciar Captura
                </button>
              </div>
              <div className={styles.imageContainer}>
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
                <img id="fingerprintImage" alt="" src="" className={styles.fingerprintImage} />
              </div>
            </div>
            <div className={styles.personalInfoContainer}>
              <SignerName
                styles={styles}
                elementId={this.props.client || {}}
                who={this.state.who}
                handleWhoChange={this.handleWhoChange}
                collectionId={this.props.collectionId}
              />
              <SignerRut
                styles={styles}
                elementId={this.props.client || {}}
                rut={this.state.rut}
                handleRutChange={this.handleRutChange}
                handleRutValidation={this.handleRutValidation}
                checked={this.state.checked}
                valid={this.state.valid}
                collectionId={this.props.collectionId}
              />
              <SignerReason
                styles={styles}
                elementId={this.props.client || {}}
                materia={this.props.client || ''}
                why={this.state.why}
                handleWhyChange={this.handleWhyChange}
                collectionId={this.props.collectionId}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <input
                type="button"
                id="saveSignature"
                value="aceptar"
                disabled={!(this.state.who !== '' && this.state.valid && this.props.isCaptured)}
                style={
                  this.state.who !== '' && this.state.valid && this.props.isCaptured
                    ? {
                        color: '#fff',
                        backgroundColor: '#2196f3'
                      }
                    : null
                }
                onClick={this.saveCapture}
              />
              <button id="cancelSignature" onClick={this.closeModal}>
                Cancelar
              </button>
            </div>
          </div>
        </Modal>
        <button onClick={this.openModal}>
          <MdSignature />
          <MdFingerprint />
          CAPTURA DE FIRMA Y HUELLA DIGITAL
        </button>
      </div>
    )
  }
}

export default withFingerprint(withSignature(FingerprintAndSignature))
