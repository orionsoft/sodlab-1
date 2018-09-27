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
    captureFingerprintPng: true,
    captureFingerprintWsq: false,
    activeFingerprint: null,
    activeSignature: null,
    fileId: '',
    currentDate: '',
    currentTime: ''
  }

  componentDidMount() {
    if (!this.props.filename) return

    const filenameLength = this.props.filename.split('.').length
    const why = this.props.filename
      .split('.')
      .splice(0, filenameLength - 1)
      .join(' ')
    return this.handleWhyChange(why)
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
  }

  closeModal = () => {
    localStorage.removeItem('fingerprintPng')
    if (localStorage.getItem(this.state.fileId) !== null) localStorage.removeItem(this.state.fileId)
    this.setState({modalIsOpen: false})
  }

  handleClientChange = client => this.setState({client})

  handleWhoChange = who => this.props.handleWhoChange(who, () => this.setState({who}))

  handleWhyChange = why => this.props.handleWhyChange(why, () => this.setState({why}))

  handleRutChange = rut => this.setState({rut})

  startSignatureCapture = () => {
    this.props.startCapture()
  }

  captureFingerprintPng = () => {
    this.props.startFingerprint('pngImage')
  }

  captureFingerprintWsq = () => {
    this.props.stopFingerprintCapturing()
    const {currentDate, currentTime} = formattedDate()
    this.setState({
      fileId: `${currentDate}_${currentTime}_${this.state.rut}`,
      currentDate,
      currentTime
    })
    this.props.startFingerprint('compressed', `${currentDate}_${currentTime}_${this.state.rut}`)
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

  saveCapture = async () => {
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
        return
      }
    }

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

  @autobind
  fetchPdfPage() {
    const {envId, uniqueId, activePage} = this.props
    this.props.pages
      .filter(page => page.page === this.props.activePage.toString())
      .map(async (page, index) => {
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
      console.log('uploadObject', error)
      throw new Error('Error al guardar el objecto biometrico')
    }
  }

  @autobind
  async submit() {
    try {
      await this.saveCapture()
    } catch (error) {
      this.props.showMessage('Error al insertar la huella y/o firma')
      return
    }

    this.props.changeState({
      isOptionsMenuOpen: false,
      loading: true
    })

    const {activeFingerprint, activeSignature, who, rut, currentDate, currentTime} = this.state
    const {envId, uniqueId, filename, activePage, posX, posY} = this.props

    if (activeFingerprint === null && activeSignature === null) {
      this.props.changeState({
        loading: false
      })

      return this.props.showMessage(
        'No se ha seleccionado ninguna huella o firma para aplicar al documento'
      )
    }

    if (activeSignature) this.uploadObject(activeSignature.imageSrc, 'signature')
    if (activeFingerprint) {
      this.uploadObject(activeFingerprint.imageSrc, 'fingerprint')
      const wsqBase64 = localStorage.getItem(this.state.fileId)
      localStorage.removeItem('fingerprintPng')
      localStorage.removeItem(this.state.fileId)
      this.uploadObject(wsqBase64, 'fingerprint')
    }

    const response = await fetch(`${apiUrl}/api/images`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        envId,
        uniqueId,
        pdfFilename: filename,
        signatureFilename: `${this.state.fileId}.signature.png`,
        fingerprintFilename: `${this.state.fileId}.fingerprint.png`,
        signerName: who,
        signerRut: rut,
        currentDate,
        currentTime,
        page: activePage - 1,
        posx: posX,
        posy: posY
      })
    })
    const {Objects} = await response.json()
    const updatedObjects = [...this.props.objects, ...Objects]
    this.props.changeState({
      objects: updatedObjects
    })

    this.fetchPdfPage()
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
            <div className={styles.deviceContainer}>
              <Device
                device="signature"
                headerText="Captura de Firma"
                onClick={this.startSignatureCapture}
                label="iniciar captura"
                disabled={false}
                showButton={this.state.rut !== '' ? true : false}
              />
              <Device
                device="fingerprint"
                headerText="Captura de Huella"
                fingerprintImgSrc={
                  this.props.isPngCaptured ? localStorage.getItem('fingerprintPng') : ''
                }
                onClick={
                  this.props.isPngCaptured ? this.captureFingerprintWsq : this.captureFingerprintPng
                }
                label={
                  !this.props.isPngCaptured
                    ? 'primera captura'
                    : !this.props.isWsqCaptured
                      ? 'segunda captura'
                      : 'captura realizada'
                }
                disabled={
                  !this.props.isPngCaptured ? false : !this.props.isWsqCaptured ? false : true
                }
                showButton={this.state.rut !== '' ? true : false}
              />
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
                disabled={
                  !(
                    this.state.who !== '' &&
                    this.props.isCaptured &&
                    this.props.isPngCaptured &&
                    this.props.isWsqCaptured
                  )
                }
                onClick={this.submit}
              />
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

export default withFingerprint(withSignature(DocumentEditorForm))
