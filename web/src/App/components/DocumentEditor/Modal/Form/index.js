import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import Modal from 'react-modal'
import MdFingerprint from 'react-icons/lib/md/fingerprint'
import MdSignature from 'react-icons/lib/md/border-color.js'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import Button from 'orionsoft-parts/lib/components/Button'
import withFingerprint from '../../FingerprintReader/withFingerprint'
import withSignature from '../../SignatureCapture/withSignature'
import SignerName from './Fields/name'
import SignerRut from './Fields/rut'
import SignerReason from './Fields/reason'
import Device from './Device'
import apiUrl from 'App/components/DocumentEditor/helpers/url'
import formattedDate from 'App/components/DocumentEditor/helpers/formattedDate'
import requestSignedUrl from 'App/components/DocumentEditor/helpers/requestSignedUrl'
import uploadFile from 'App/components/DocumentEditor/helpers/uploadFile'
import downloadImage from 'App/components/DocumentEditor/helpers/downloadImage'
import styles from './styles.css'

@withGraphQL(gql`
  query getFormOneOfSelectOptions($environmentId: ID, $formId: ID, $fieldName: String) {
    selectOptions(environmentId: $environmentId, formId: $formId, fieldName: $fieldName) {
      label
      value
    }
  }
`)
class DocumentEditorForm extends React.Component {
  static propTypes = {
    // fingerprint reader props
    startFingerprint: PropTypes.func,
    stopFingerprintCapturing: PropTypes.func,
    renderToggleConnectedStatus: PropTypes.func,
    renderToggleHelpMessages: PropTypes.func,
    resetFingerprintState: PropTypes.func,
    isFingerprintReaderActive: PropTypes.bool,
    isPngCaptured: PropTypes.bool,
    isWsqCaptured: PropTypes.bool,
    // signature capture props
    isCaptured: PropTypes.bool,
    handleWhoChange: PropTypes.func,
    handleWhyChange: PropTypes.func,
    startCapture: PropTypes.func,
    signatureState: PropTypes.object,
    handleSubmitSignature: PropTypes.func,
    // document editor props
    changeState: PropTypes.func,
    insertImage: PropTypes.func,
    apiFilename: PropTypes.string,
    filename: PropTypes.string,
    pages: PropTypes.array,
    pagesSrc: PropTypes.array,
    signatureImages: PropTypes.array,
    activePage: PropTypes.number,
    posX: PropTypes.number,
    posY: PropTypes.number,
    apiObjects: PropTypes.array,
    envId: PropTypes.string,
    uniqueId: PropTypes.string,
    objects: PropTypes.array,
    // ERP props
    showMessage: PropTypes.func,
    selectOptions: PropTypes.object,
    collectionId: PropTypes.string,
    firstNameKey: PropTypes.string,
    lastNameKey: PropTypes.string
  }

  state = {
    client: null,
    modalIsOpen: false,
    enableFingerprint: false,
    enableSignature: false,
    who: '',
    why: '',
    rut: '',
    selectedOption: '',
    enableSubmit: false,
    activeFingerprint: null,
    activeSignature: null,
    fileId: '',
    currentDate: '',
    currentTime: ''
  }

  @autobind
  setWhy() {
    if (!this.props.filename) return

    const filenameLength = this.props.filename.split('.').length
    const why = this.props.filename
      .split('.')
      .splice(0, filenameLength - 1)
      .join(' ')
    return this.handleWhyChange(why)
  }

  @autobind
  setCurrentDateAndTime() {
    const {currentDate, currentTime} = formattedDate()
    this.setState({
      currentDate,
      currentTime
    })
  }

  openModal = selectedOption => {
    this.setCurrentDateAndTime()
    this.setWhy()
    this.setState({modalIsOpen: true, selectedOption})
  }

  closeModal = () => {
    this.props.stopFingerprintCapturing()
    this.props.resetFingerprintState()
    if (localStorage.getItem('fingerprintPng') !== null) localStorage.removeItem('fingerprintPng')
    if (localStorage.getItem(this.state.fileId) !== null) localStorage.removeItem(this.state.fileId)
    this.setState({modalIsOpen: false})
  }

  handleClientChange = client => this.setState({client})

  handleWhoChange = who => this.props.handleWhoChange(who, () => this.setState({who}))

  handleWhyChange = why => this.props.handleWhyChange(why, () => this.setState({why}))

  handleRutChange = rut => {
    const {currentDate, currentTime} = this.state
    const fileId = `${currentDate}_${currentTime}_${rut}`
    this.setState({fileId, rut})
  }

  startSignatureCapture = () => {
    this.props.startCapture()
    this.props.showMessage('Capturando la firma')
  }

  captureFingerprintPng = () => {
    this.props.startFingerprint('pngImage')
    this.props.showMessage('Primera captura de huella en curso')
  }

  captureFingerprintWsq = () => {
    this.props.stopFingerprintCapturing()
    this.props.startFingerprint('compressed', this.state.fileId)
    this.props.showMessage('Segunda captura de huella en curso')
  }

  insertImage = (type, id, imageSrc, name, rut) => {
    return new Promise(resolve => {
      this.setState({
        [type]: {id, imageSrc, name, rut}
      })
      this.props.changeState({
        signatureImages: [...this.props.signatureImages, {id, imageSrc, name, rut}]
      })

      return resolve()
    })
  }

  @autobind
  async saveCapture() {
    const {selectedOption} = this.state
    if (selectedOption === 'signature' || selectedOption === 'both') {
      const signature = document.getElementById('signatureImageBox').firstChild
      if (signature.src !== null || signature.src !== '') {
        try {
          await this.insertImage(
            'activeSignature',
            `${this.state.rut}.signature`,
            signature.src,
            this.state.who,
            this.state.rut
          )
        } catch (err) {
          return err
        }
      }
    }

    if (selectedOption === 'fingerprint' || selectedOption === 'both') {
      const fingerprint = document.getElementById('fingerprintImage')
      if (fingerprint.src !== null || fingerprint.src !== '') {
        try {
          await this.insertImage(
            'activeFingerprint',
            `${this.state.rut}.fingerprint`,
            fingerprint.src,
            this.state.who,
            this.state.rut
          )
        } catch (err) {
          return
        }
      }
    }
  }

  @autobind
  fetchPdfPage() {
    const {envId, uniqueId, activePage} = this.props
    this.props.pages
      .filter(page => page.page === activePage.toString())
      .map(async page => {
        try {
          const params = {
            bucket: 'work',
            key: `${envId}/${uniqueId}/${page.name}`,
            operation: 'getObject'
          }
          const src = await downloadImage(params)
          let {pagesSrc} = this.props
          pagesSrc[activePage - 1] = {
            name: page.name,
            src,
            index: activePage - 1
          }
          pagesSrc = pagesSrc.sort((a, b) => a.index - b.index)

          return this.props.changeState({
            pagesSrc,
            loading: false
          })
        } catch (err) {
          this.props.changeState({loading: false})
          this.props.showMessage('No se pudo completar la solicitud. Favor volver a intentarlo')
        }
      })
  }

  b64toBlob = (b64Data, contentType, sliceSize) => {
    contentType = contentType || ''
    sliceSize = sliceSize || 512

    let byteCharacters = atob(b64Data)
    let byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize)

      let byteNumbers = new Array(slice.length)
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      let byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
    }

    let blob = new Blob(byteArrays, {type: contentType})
    return blob
  }

  @autobind
  async uploadObject(imageSrc, type) {
    const block = imageSrc.split(';')
    const contentType = block[0].split(':')[1]
    const extension = contentType === 'image/png' ? 'png' : 'wsq'
    const realData = block[1].split(',')[1]
    const blob = this.b64toBlob(realData, contentType)
    const params = {
      bucket: 'work',
      key: `${this.props.envId}/${this.props.uniqueId}/${this.state.fileId}.${type}.${extension}`,
      operation: 'putObject',
      contentType
    }
    try {
      const signedRequest = await requestSignedUrl(params)
      await uploadFile(signedRequest, blob, contentType)
    } catch (error) {
      throw new Error('Error al guardar el objecto biometrico')
    }
  }

  @autobind
  async submit() {
    try {
      await this.saveCapture()
      this.props.stopFingerprintCapturing()
      this.props.resetFingerprintState()
    } catch (error) {
      this.props.showMessage('Error al insertar la huella y/o firma')
      return
    }

    this.props.changeState({
      isOptionsMenuOpen: false,
      loading: true
    })

    const {
      activeFingerprint,
      activeSignature,
      who,
      rut,
      currentDate,
      currentTime,
      selectedOption
    } = this.state
    const {envId, uniqueId, filename, activePage, posX, posY} = this.props

    if (activeFingerprint === null && activeSignature === null) {
      this.props.changeState({
        loading: false
      })

      return this.props.showMessage(
        'No se ha seleccionado ninguna huella o firma para aplicar al documento'
      )
    }

    if (activeSignature) {
      await this.uploadObject(activeSignature.imageSrc, 'signature')
    }
    if (activeFingerprint) {
      await this.uploadObject(activeFingerprint.imageSrc, 'fingerprint')
      const wsqBase64 = localStorage.getItem(this.state.fileId)
      localStorage.removeItem('fingerprintPng')
      localStorage.removeItem(this.state.fileId)
      await this.uploadObject(wsqBase64, 'fingerprint')
    }

    let body = {
      envId,
      uniqueId,
      pdfFilename: filename,
      signerName: who,
      signerRut: rut,
      currentDate,
      currentTime,
      page: activePage - 1,
      posx: posX,
      posy: posY
    }

    if (selectedOption === 'fingerprint' || selectedOption === 'both') {
      body.fingerprintFilename = `${this.state.fileId}.fingerprint.png`
    }

    if (selectedOption === 'signature' || selectedOption === 'both') {
      body.signatureFilename = `${this.state.fileId}.signature.png`
    }

    const response = await fetch(`${apiUrl}/api/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })
    const {Objects, size} = await response.json()
    const updatedObjects = [...this.props.objects, ...Objects]
    this.props.changeState({
      objects: updatedObjects,
      size: size
    })
    this.fetchPdfPage()
  }

  @autobind
  checkSubmitCondition() {
    switch (this.state.selectedOption) {
      case 'fingerprint':
        return !(this.state.who !== '' && this.props.isPngCaptured && this.props.isWsqCaptured)
      case 'signature':
        return !(this.state.who !== '' && this.props.isCaptured)
      case 'both':
        return !(
          this.state.who !== '' &&
          this.props.isCaptured &&
          this.props.isPngCaptured &&
          this.props.isWsqCaptured
        )
      default:
        return true
    }
  }

  @autobind
  renderSignatureCapture() {
    const {selectedOption, rut} = this.state
    if (selectedOption === 'fingerprint') return

    return (
      <Device
        device="signature"
        headerText="Captura de Firma"
        onClick={this.startSignatureCapture}
        label="iniciar captura"
        disabled={false}
        showButton={rut !== '' ? true : false}
      />
    )
  }

  @autobind
  renderFingerprintCapture() {
    const {selectedOption, rut} = this.state
    const {isPngCaptured, isWsqCaptured, isFingerprintReaderActive} = this.props
    if (selectedOption === 'signature') return
    const disabled = isFingerprintReaderActive
      ? true
      : !isPngCaptured
      ? false
      : !isWsqCaptured
      ? false
      : true

    const label = isFingerprintReaderActive
      ? '...'
      : !isPngCaptured
      ? 'primera captura'
      : !isWsqCaptured
      ? 'segunda captura'
      : 'captura realizada'

    return (
      <Device
        device="fingerprint"
        headerText="Captura de Huella"
        fingerprintImgSrc={isPngCaptured ? localStorage.getItem('fingerprintPng') : ''}
        onClick={isPngCaptured ? this.captureFingerprintWsq : this.captureFingerprintPng}
        label={label}
        disabled={disabled}
        showButton={rut !== '' ? true : false}
      />
    )
  }

  render() {
    return (
      <div style={{overflow: 'hidden', display: 'flex'}}>
        <Modal
          appElement={document.querySelector('#root')}
          isOpen={this.state.modalIsOpen}
          onClose={this.closeModal}
          className={styles.modal}
          overlayClassName={styles.overlay}
          contentLabel="Confirmación">
          <div className={styles.contentContainer}>
            <div className={styles.deviceContainer}>
              {this.renderSignatureCapture()}
              {this.renderFingerprintCapture()}
            </div>
            <div className={styles.personalInfoContainer}>
              <SignerRut
                client={this.state.client}
                handleRutChange={this.handleRutChange}
                collectionId={this.props.collectionId}
                selectOptions={this.props.selectOptions}
                valueKey={this.props.valueKey}
                handleClientChange={this.handleClientChange}
                passProps={this.props.passProps}
              />
              {this.state.client && (
                <SignerName
                  elementId={this.state.client}
                  handleWhoChange={this.handleWhoChange}
                  collectionId={this.props.collectionId}
                  firstNameKey={this.props.passProps.firstNameKey}
                  lastNameKey={this.props.passProps.lastNameKey}
                />
              )}
              <SignerReason
                why={this.state.why}
                handleWhyChange={this.handleWhyChange}
                filename={this.props.filename}
              />
            </div>
            <div className={styles.buttonsContainer}>
              <Button
                linkButton={false}
                label="cancelar"
                primary={false}
                danger={true}
                big={false}
                onClick={this.closeModal}
              />
              <Button
                linkButton={false}
                label="aceptar"
                primary={true}
                big={false}
                disabled={this.checkSubmitCondition()}
                onClick={this.submit}
              />
            </div>
          </div>
        </Modal>
        <div className={styles.optionsButtonsContainer}>
          <button onClick={() => this.openModal('fingerprint')}>
            <div className={styles.innerButtonContainer}>
              <div className={styles.svgContainer}>
                <MdFingerprint />
              </div>
              <div className={styles.textContainer}>CAPTURA DE HUELLA</div>
            </div>
          </button>
          <button onClick={() => this.openModal('signature')}>
            <div className={styles.innerButtonContainer}>
              <div className={styles.svgContainer}>
                <MdSignature />
              </div>
              <div className={styles.textContainer}>CAPTURA DE FIRMA</div>
            </div>
          </button>
          <button onClick={() => this.openModal('both')}>
            <div className={styles.innerButtonContainer}>
              <div className={styles.svgContainer}>
                <MdSignature />
                <MdFingerprint />
              </div>
              <div className={styles.textContainer}>CAPTURA DE FIRMA Y HUELLA DIGITAL</div>
            </div>
          </button>
        </div>
      </div>
    )
  }
}

export default withFingerprint(withSignature(DocumentEditorForm))
