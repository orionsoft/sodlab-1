import React from 'react'
import PropTypes from 'prop-types'
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
import apiUrl from '../../helpers/url'
import formattedDate from '../../helpers/formattedDate'
import arrayBufferToBase64 from '../../helpers/arrayBufferToBase64'
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
    fileId: ''
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
    const date = new Date()
    const currentTime = date.getTime().toString()
    this.setState({fileId: `${currentTime}_${this.state.rut}`})
    this.props.startFingerprint('compressed', `${currentTime}_${this.state.rut}`)
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

  fetchPdfPage = () => {
    this.props.pages
      .filter(fileInfo => fileInfo.page === this.props.activePage.toString())
      .map(async (fileInfo, index) => {
        try {
          const response = await fetch(`${apiUrl}/api/images/pdf/${fileInfo.name}/${index}`)
          const buffer = await response.arrayBuffer()
          const base64Flag = 'data:image/png;base64,'
          const imageStr = arrayBufferToBase64(buffer)
          const src = base64Flag + imageStr
          let {pagesSrc} = this.props
          pagesSrc[this.props.activePage - 1] = {
            name: fileInfo.name,
            src,
            index: this.props.activePage - 1
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

  appendDataToForm = (type, signature, formData) => {
    if (typeof signature === 'undefined' || signature === null) return

    const block = signature.imageSrc.split(';')
    const contentType = block[0].split(':')[1]
    const realData = block[1].split(',')[1]
    const blob = this.b64toBlob(realData, contentType)
    // const imageIdArray = signature.id.split('.')
    // const identifier = type === '' ? imageIdArray[imageIdArray.length - 1] : type
    formData.append(type, blob, `${signature.id}.png`)
    formData.append('signer_name', signature.name)
    formData.append('signer_rut', signature.rut)

    if (type === 'fingerprint') {
      const wsqBase64 = localStorage.getItem(this.state.fileId)
      const block = wsqBase64.split(';')
      const contentType = block[0].split(':')[1]
      const realData = block[1].split(',')[1]
      const blob = this.b64toBlob(realData, contentType)
      formData.append('fingerprintWsq', blob, `${this.state.fileId}.wsq`)
      localStorage.removeItem(this.state.fileId)
    }

    return
  }

  submit = async () => {
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

    const {activeFingerprint, activeSignature} = this.state
    const {posX, posY} = this.props

    if (activeFingerprint === null && activeSignature === null) {
      this.props.changeState({
        loading: false
      })

      return this.props.showMessage(
        'No se ha seleccionado ninguna huella o firma para aplicar al documento'
      )
    }

    const form = document.createElement('form')
    form.enctype = 'multipart/form-data'
    const formData = new FormData(form)
    this.appendDataToForm('signature', activeSignature, formData)
    this.appendDataToForm('fingerprint', activeFingerprint, formData)
    formData.append('pdfFileName', this.props.apiFilename)
    formData.append('page', this.props.activePage - 1)
    const date = formattedDate()
    formData.append('currentDate', date.currentDate)
    formData.append('currentTime', date.currentTime)

    try {
      const response = await fetch(`${apiUrl}/api/images/${posX}/${posY}`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (!data) {
        this.props.showMessage('No se pudo completar la solicitud. Favor volver a intentarlo')

        return this.props.changeState({loading: false})
      } else {
        localStorage.removeItem('fingerprintPng')
        if (data.paths) {
          const newPaths = data.paths.map(file => {
            const fileExtension = file.type === 'fingerprint' ? 'wsq' : 'png'
            return {fileId: `${this.state.fileId}.${fileExtension}`, path: file.path}
          })
          this.props.changeState({
            apiObjects: [...this.props.apiObjects, ...newPaths]
          })
        }
        return this.fetchPdfPage()
      }
    } catch (err) {
      this.props.showMessage('No se ha podido firmar el documento')
    }
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
                styles={styles}
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
                  styles={styles}
                  elementId={this.state.client}
                  handleWhoChange={this.handleWhoChange}
                  collectionId={this.props.collectionId}
                  firstNameKey={this.props.passProps.firstNameKey}
                  lastNameKey={this.props.passProps.lastNameKey}
                />
              )}
              <SignerReason
                styles={styles}
                elementId={this.props.client}
                why={this.state.why}
                handleWhyChange={this.handleWhyChange}
                collectionId={this.props.collectionId}
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
