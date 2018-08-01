import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import withSignature from './withSignature'
import TextSection from '../common/textSection'
import SignerName from '../common/signerName'
import SignerRut from '../common/signerRut'
import SignerReason from '../common/signerReason'
import MdSignature from 'react-icons/lib/md/border-color.js'
import styles from './styles.css'

class SignatureModal extends React.Component {
  static propTypes = {
    addSignatureImage: PropTypes.func,
    handleSubmitImg: PropTypes.func,
    signatureState: PropTypes.object,
    isCaptured: PropTypes.bool,
    handleWhoChange: PropTypes.func,
    handleWhyChange: PropTypes.func,
    startCapture: PropTypes.func,
    handleSubmitSignature: PropTypes.func,
    placeholder: PropTypes.string,
    form: PropTypes.object
  }

  state = {
    modalIsOpen: false,
    placeholder: this.props.placeholder,
    who: '',
    why: '',
    rut: '',
    valid: false,
    checked: null
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
  }

  closeModal = () => {
    this.setState({modalIsOpen: false})
  }

  handleWhoChange = who => this.props.handleWhoChange(who, () => this.setState({who}))

  handleWhyChange = why => this.props.handleWhyChange(why, () => this.setState({why}))

  handleRutChange = rut => this.setState({rut})

  handleRutValidation = (valid, checked) => this.setState({valid, checked})

  startCapture = () => {
    this.props.startCapture()
  }

  saveCapture = () => {
    this.props.handleSubmitSignature(this.state.rut, this.state.who)
    this.closeModal()
  }

  render() {
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
            <div className={styles.imageContainer}>
              <div id="signatureImageBox" className={styles.signatureImageBox} />
              <button
                id="startSignatureCapture"
                className={styles.startCapture}
                onClick={this.startCapture}>
                Iniciar Captura
              </button>
            </div>
            <div className={styles.personalInfoContainer}>
              <SignerName
                styles={styles}
                signerId={this.props.form.props.state.rut_cliente || ''}
                who={this.state.who}
                handleWhoChange={this.handleWhoChange}
              />
              <SignerRut
                styles={styles}
                signerId={this.props.form.props.state.rut_cliente || ''}
                rut={this.state.rut}
                handleRutChange={this.handleRutChange}
                handleRutValidation={this.handleRutValidation}
                checked={this.state.checked}
                valid={this.state.valid}
              />
              <SignerReason
                styles={styles}
                materia={this.props.form.props.state.materia || ''}
                why={this.state.why}
                handleWhyChange={this.handleWhyChange}
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
          CAPTURA DE FIRMA DIGITAL
        </button>
      </div>
    )
  }
}

export default withSignature(SignatureModal)
