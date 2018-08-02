import React from 'react'
import Modal from 'react-modal'
import styles from './styles.css'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import Select from 'orionsoft-parts/lib/components/fields/Select'
// import Fingerprint from '../FingerprintReader'
// import Signature from '../SignatureCapture'
import FingerprintAndSignature from '../Fingerprint-Signature'
import API_URL from '../helpers/url'
import {MdNoteAdd, MdFileDownload} from 'react-icons/lib/md'
import {FaSpinner} from 'react-icons/lib/fa'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import cleanFileUrl from '../helpers/cleanFileUrl'
import {ClientConsumer} from '../context'
import {withRouter} from 'react-router'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import autobind from 'autobind-decorator'
/*
  PENDING:
  - Refactor this whole component. Every section in the modal must have its own component
  - Refactor de common components to be more general
  - Use the value prop to receive de url of the pdf and keep working on it
*/
@withRouter
@withGraphQL(gql`
  query getFormOneOfSelectOptions($environmentId: ID, $formId: ID, $fieldName: String) {
    selectOptions(environmentId: $environmentId, formId: $formId, fieldName: $fieldName) {
      label
      value
    }
  }
`)
@withMutation(gql`
  mutation generateUploadCredentials($name: String, $size: Float, $type: String) {
    result: generateUploadCredentials(name: $name, size: $size, type: $type) {
      fileId
      url
      fields
      key
    }
  }
`)
@withMutation(gql`
  mutation completeUpload($fileId: ID) {
    completeUpload(fileId: $fileId) {
      _id
    }
  }
`)
@withMessage
export default class Main extends React.Component {
  static propTypes = {
    value: PropTypes.object.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    showMessage: PropTypes.func,
    form: PropTypes.object,
    passProps: PropTypes.object,
    environmentId: PropTypes.string,
    selectOptions: PropTypes.object,
    errorMessage: PropTypes.func,
    completeUpload: PropTypes.func
  }

  state = {
    isOpen: this.props.isOpen,
    onClose: this.props.onClose,
    loading: false,
    file: null,
    // original name of the uploaded file
    uploadedFileName: '',
    // timestamp + uploadedFileName. This is sent to the backend
    pdfFileName: '',
    pdfImagesSrc: [],
    activePdfImageSrc: '',
    pdfImages: [],
    activePdfImagePage: 1,
    posX: 0,
    posY: 0,
    activeSignature: null,
    activeFingerprint: null,
    activePenSignature: null,
    signatureImages: [],
    isOptionsMenuOpen: false
  }

  // componentDidUpdate(prevProps) {
  //   if (this.props.value !== prevProps.value) {
  //     const pdfFileName = cleanFileUrl(this.props.value.meta.s3Path)
  //     const uploadedFileName = this.props.value.meta.s3Path.split('.')[1]
  //
  //     this.setState({loading: true, uploadedFileName, pdfFileName})
  //     fetch(`${API_URL}/api/files/aws/get`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json; charset=utf-8'
  //       },
  //       body: JSON.stringify(this.props.value)
  //     })
  //       .then(res => res.json())
  //       .then(data => {
  //         this.setState({
  //           pdfImages: data.message
  //         })
  //         this.fetchPdfImages()
  //       })
  //       .catch(err => console.log(err))
  //   }
  // }

  resetState = () => {
    this.setState({
      loading: false,
      file: null,
      // original name of the uploaded file
      uploadedFileName: '',
      // timestamp + uploadedFileName. This is sent to the backend
      pdfFileName: '',
      pdfImagesSrc: [],
      activePdfImageSrc: '',
      pdfImages: [],
      activePdfImagePage: 1,
      posX: 0,
      posY: 0,
      activeSignature: null,
      activeFingerprint: null,
      activePenSignature: null,
      signatureImages: [],
      isOptionsMenuOpen: false
    })
  }

  handleSubmitPdf = () => {
    this.setState({
      size: 0,
      file: null,
      uploadedFileName: '',
      pdfFileName: '',
      activePdfImageSrc: '',
      activePdfImagePage: 1,
      pdfImages: [],
      pdfImagesSrc: [],
      loading: true
    })
    const file = document.getElementById('pdf_file').files[0]
    const form = document.createElement('form')
    const size = file.size
    form.enctype = 'multipart/form-data'
    const formData = new FormData(form)
    const date = new Date()
    const uploadedFileName = file.name.replace(/ /g, '_')
    const pdfFileName = date.getTime().toString() + '.' + uploadedFileName
    this.setState({file, pdfFileName, uploadedFileName})
    formData.append('pdf_upload', file, pdfFileName)

    fetch(`${API_URL}/api/pdf`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        this.setState({pdfImages: data.message, size: size})
        this.fetchPdfImages()
      })
      .catch(err => console.log(err))
  }

  handleSubmitImg = () => {
    this.setState({
      isOptionsMenuOpen: false,
      loading: true
    })
    const {posX, posY} = this.state

    const form = document.createElement('form')
    form.enctype = 'multipart/form-data'
    const formData = new FormData(form)

    const {activeSignature, activeFingerprint, activePenSignature} = this.state
    if (activeSignature === null && activeFingerprint === null && activePenSignature === null) {
      this.setState({
        isOptionsMenuOpen: false,
        loading: false
      })
      return alert('No se ha seleccionado ninguna huella o firma para aplicar al documento')
    }

    const appendDataToForm = (type, signature, formData) => {
      if (typeof signature === 'undefined' || signature === null) return

      // Split the base64 string in data and contentType
      const block = signature.imageSrc.split(';')
      // Get the content type of the image
      const contentType = block[0].split(':')[1]
      // get the real base64 content of the file
      const realData = block[1].split(',')[1]
      // Convert it to a blob to upload
      const blob = b64toBlob(realData, contentType)
      const imageIdArray = signature.id.split('.')
      const identifier = type === '' ? imageIdArray[imageIdArray.length - 1] : type
      formData.append(identifier, blob, signature.id)
      formData.append(identifier, identifier)
      formData.append(`signer_name`, signature.name)
      formData.append(`signer_rut`, signature.rut)
    }

    appendDataToForm('', activeSignature, formData)
    appendDataToForm('signature', activePenSignature, formData)
    appendDataToForm('fingerprint', activeFingerprint, formData)

    // sometimes this next line is not executed properly before sending the request
    formData.append('pdfFileName', this.state.pdfFileName)
    formData.append('page', this.state.activePdfImagePage - 1)
    const date = this.getCurrentDate()
    formData.append('currentDate', date.currentDate)
    formData.append('currentTime', date.currentTime)

    fetch(`${API_URL}/api/images/${posX}/${posY}`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === undefined) {
          alert('No se pudo completar la solicitud. Favor volver a intentarlo')
          return this.setState({loading: false})
        } else {
          this.setState(
            {
              pdfImages: data.message,
              isOptionsMenuOpen: false
            },
            () => this.fetchPdfImage(this.state.activePdfImagePage)
          )
        }
      })
      .catch(err => console.log(err))
  }

  handleImageClick = e => {
    const img = document.getElementById('pdfImage')
    // get distance to the img from the left and top of the viewport
    const {left, top} = getOffset(img)
    const imgWidth = img.width
    const imgHeight = img.height
    // distance from the left border of the image to the mouse click
    const dX = e.pageX - left
    // distance from the bottom of the image to the mouse click
    const dY = top + imgHeight - e.pageY
    // get the mouse click distance from the borders as percentages
    const dXPercentage = dX / imgWidth
    const dYPercentage = dY / imgHeight

    this.setState({
      posX: dXPercentage,
      posY: dYPercentage,
      isOptionsMenuOpen: true
    })
  }

  handleDownloadPdf = () => {
    const pdfFileName = this.state.pdfFileName.split('.')
    const filename = pdfFileName[1] + '.' + pdfFileName[2]
    fetch(`${API_URL}/api/pdf/${this.state.pdfFileName}`)
      .then(response => response.blob())
      .then(blob => FileSaver.saveAs(blob, filename))
      .catch(err => console.log(err))
  }

  @autobind
  async requestCredentials(body) {
    const {size, uploadedFileName} = this.state
    const {result} = await this.props.generateUploadCredentials({
      name: uploadedFileName,
      size: size,
      type: body.fileType
    })
    return result
  }

  async complete(fileId) {
    this.props.onChange({_id: fileId})
    await this.props.completeUpload({fileId})
    this.props.showMessage('El archivo se cargó correctamente')
  }

  handleConfirm = async () => {
    const body = {
      fileName: this.state.pdfFileName,
      fileType: 'application/pdf'
    }
    // const fileId = await this.requestCredentials(body)
    const credentials = await this.requestCredentials(body)
    // await this.uploadFile(credentials, file)
    this.complete(credentials.fileId)
    fetch(`${API_URL}/api/files`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(data => {
        this.props.showMessage('Documento guardado con éxito')
        // this.props.onChange(data)
        this.handleClose()
      })
      .catch(err => {
        this.props.showMessage('Error al guardar documento')
      })
  }

  handleClose = () => {
    this.props.onClose()
    this.resetState()
    const splitFileName = this.state.pdfFileName.split('.')
    const fileName = `${splitFileName[0]}.${splitFileName[1]}`
    const body = {fileName, secret: 'sodlab_allow_delete'}

    fetch(`${API_URL}/api/files`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })
  }

  handlePdfImagePageChange = e => {
    this.setState({
      activePdfImageSrc: e.currentTarget.src,
      activePdfImagePage: e.currentTarget.id.split('.')[2].replace('_', '')
    })
  }

  addSignatureImage = (id, imageSrc, name, rut, callback) => {
    this.setState(
      {
        activeSignature: {id, imageSrc, name, rut},
        signatureImages: [...this.state.signatureImages, {id, imageSrc, name, rut}]
      },
      () => callback()
    )
  }

  addFingerprintOrPenSignature = (type, id, imageSrc, name, rut, callback) => {
    if (type === 'fingerprint') {
      this.setState(
        {
          activeFingerprint: {id, imageSrc, name, rut},
          signatureImages: [...this.state.signatureImages, {id, imageSrc, name, rut}]
        },
        () => callback()
      )
    } else if (type === 'pen signature') {
      this.setState(
        {
          activePenSignature: {id, imageSrc, name, rut},
          signatureImages: [...this.state.signatureImages, {id, imageSrc, name, rut}]
        },
        () => callback()
      )
    }
  }

  setActiveSignature = e => {
    const data = e.currentTarget.alt.split('/')
    const id = data[0]
    const name = data[1]
    const rut = data[2]
    const imageSrc = e.currentTarget.src
    const activeSignature = {id, imageSrc, name, rut}
    this.setState({activeSignature})
  }

  fetchPdfImages = () => {
    this.state.pdfImages.map((fileInfo, index) => {
      const randomNumber = Math.floor(Math.random() * 100000000)
      return fetch(`${API_URL}/api/images/pdf/${fileInfo.name}/${randomNumber}`)
        .then(response => {
          response.arrayBuffer().then(buffer => {
            const base64Flag = 'data:image/png;base64,'
            const imageStr = arrayBufferToBase64(buffer)
            const src = base64Flag + imageStr
            return this.setState(
              {
                pdfImagesSrc: [...this.state.pdfImagesSrc, {name: fileInfo.name, src, index}]
              },
              () =>
                this.setState({
                  pdfImagesSrc: this.state.pdfImagesSrc.sort(function(a, b) {
                    return a.index - b.index
                  }),
                  activePdfImageSrc: this.state.pdfImagesSrc[this.state.activePdfImagePage - 1].src,
                  loading: false
                })
            )
          })
        })
        .catch(err => {
          console.log(err)
          this.setState({loading: false})
          this.props.showMessage('No se pudo completar la solicitud. Favor volver a intentarlo')
        })
    })
  }

  fetchPdfImage = page => {
    this.state.pdfImages.filter(fileInfo => fileInfo.page === parseInt(page, 10)).map(fileInfo => {
      const randomNumber = Math.floor(Math.random() * 100000000)
      return fetch(`${API_URL}/api/images/pdf/${fileInfo.name}/${randomNumber}`, {
        method: 'GET'
      })
        .then(response => {
          response.arrayBuffer().then(buffer => {
            const base64Flag = 'data:image/png;base64,'
            const imageStr = arrayBufferToBase64(buffer)
            const src = base64Flag + imageStr
            let {pdfImagesSrc} = this.state
            pdfImagesSrc[page - 1] = {
              name: fileInfo.name,
              src,
              index: page - 1
            }
            return this.setState(
              {
                pdfImagesSrc
              },
              () =>
                this.setState({
                  pdfImagesSrc: this.state.pdfImagesSrc.sort(function(a, b) {
                    return a.index - b.index
                  }),
                  activePdfImageSrc: this.state.pdfImagesSrc[this.state.activePdfImagePage - 1].src,
                  loading: false
                })
            )
          })
        })
        .catch(err => {
          // !!! PENDING: HANDLE ERROR, SHOW USER SOMETHING IS WRONG
          console.log(err)
          this.setState({loading: false})
          alert('No se pudo completar la solicitud. Favor volver a intentarlo')
        })
    })
  }

  closeOptionsMenu = () => this.setState({isOptionsMenuOpen: false})

  renderActivePdfImageSrc = () => {
    return (
      <img
        id="pdfImage"
        src={this.state.activePdfImageSrc}
        alt=""
        onClick={this.handleImageClick}
        width="500"
      />
    )
  }

  renderPdfPagesRow = () => {
    return this.state.pdfImagesSrc.map(image => {
      const page = image.name.split('.')[2].replace('_', '') || this.state.activePdfImagePage
      const style =
        page === this.state.activePdfImagePage
          ? {boxShadow: 'rgb(0,159,255) 0 0 1px 1px'}
          : {boxShadow: ''}
      return (
        <img
          key={image.name}
          id={image.name}
          src={image.src}
          alt=""
          style={style}
          onClick={this.handlePdfImagePageChange}
        />
      )
    })
  }

  renderSignatureImages = () => {
    return this.state.signatureImages.map((image, index) => {
      return (
        <div key={index}>
          <img
            id={`${image.id}.${image.name}`}
            src={image.imageSrc}
            alt={`${image.id}/${image.name}/${image.rut}`}
            onClick={this.setActiveSignature}
          />
          <span>{image.name.toUpperCase()}</span>
          <span>{image.rut}</span>
        </div>
      )
    })
  }

  // renderHelpMessages = () => {
  //   const { activePdfImageSrc } = this.state
  //   if (activePdfImageSrc === '') return <span>Carga un documento haciendo click en el botón "CARGAR DOCUMENTO"</span>
  //   else if (activePdfImageSrc !== '') return <span>Haz click en el lugar del documento en donde desees insertar una huella o firma digital</span>
  // }

  getCurrentDate() {
    const date = new Date()
    let month = date.getMonth() + 1
    let day = date.getDate()
    month = month.toString().length === 1 ? '0' + month : month
    day = day.toString().length === 1 ? '0' + day : day
    let hours = date.getHours().toString().length === 1 ? '0' + date.getHours() : date.getHours()
    let minutes =
      date.getMinutes().toString().length === 1 ? '0' + date.getMinutes() : date.getMinutes()
    let seconds =
      date.getSeconds().toString().length === 1 ? '0' + date.getSeconds() : date.getSeconds()
    const currentDate = `${date.getFullYear()}.${month}.${day}`
    const currentTime = `${hours}:${minutes}:${seconds}`
    return {currentDate, currentTime}
  }

  renderPDFSelect() {
    if (!this.state.client) return
    return (
      <div>
        <input type="file" id="pdf_file" accept=".pdf" onChange={this.handleSubmitPdf} />
        <label htmlFor="pdf_file">
          <MdNoteAdd />
          CARGAR DOCUMENTO
        </label>
      </div>
    )
  }

  render() {
    const {uploadedFileName} = this.state
    return (
      <Modal
        appElement={document.querySelector('#root')}
        id="pdfEditorModal"
        isOpen={this.props.isOpen}
        onRequestClose={() => this.state.onClose()}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Confirmación">
        <div className={styles.headerContainer}>
          <span>{uploadedFileName.toUpperCase() || 'NO SE HA SELECCIONADO NINGÚN DOCUMENTO'}</span>
          <div>
            <Select
              value={this.state.client && this.state.client[this.props.passProps.valueKey]}
              onChange={change =>
                this.setState({client: {[this.props.passProps.valueKey]: change}})
              }
              options={this.props.selectOptions}
              errorMessage={this.props.errorMessage}
              {...this.props.passProps}
            />
            {this.renderPDFSelect()}
          </div>
        </div>
        <div id="pdfPagesRowContainer" className={styles.pagesContainer}>
          {this.state.loading ? (
            <div className={styles.loaderContainer}>
              <FaSpinner className={styles.iconSpinMedium} />
            </div>
          ) : (
            this.renderPdfPagesRow()
          )}
        </div>
        <div className={styles.editorContainer}>
          <div className={styles.pdfImageContainer}>
            {/* <div className={styles.helpMessageContainer}>{this.renderHelpMessages()}</div> */}
            {this.state.loading ? (
              <div className={styles.loaderContainer}>
                <FaSpinner className={styles.iconSpinBig} />
              </div>
            ) : (
              this.renderActivePdfImageSrc()
            )}
          </div>
          <div className={styles.imagesContainer}>{this.renderSignatureImages()}</div>
          <div className={styles.optionsContainer}>
            <div>
              <button id="downloadPdfBtn" onClick={this.handleDownloadPdf}>
                <MdFileDownload />
                DESCARGAR
              </button>
            </div>
            <div>
              <button id="downloadPdfBtn" onClick={this.handleConfirm}>
                CONFIRMAR
              </button>
            </div>
            <div>
              <button onClick={this.handleClose} id="closePdfEditorBtn">
                CERRAR
              </button>
            </div>
          </div>
        </div>
        <Modal
          appElement={document.querySelector('#root')}
          id="pdfOptionsMenuModal"
          isOpen={this.state.isOptionsMenuOpen}
          onRequestClose={this.closeOptionsMenu}
          className={styles.optionsMenuModal}
          overlayClassName={styles.optionsMenuOverlay}>
          <div className={styles.btnContainer}>
            {/*  not */}
            {/* <ClientConsumer>
              {rutClient => (
                <Fingerprint
                  client={this.state.client}
                  addSignatureImage={this.addSignatureImage}
                  handleSubmitImg={this.handleSubmitImg}
                  {...this.props} // form
                />
              )}
            </ClientConsumer> */}
            {/* <ClientConsumer>
              {rutClient => (
                <Signature
                  client={this.state.client}
                  addSignatureImage={this.addSignatureImage}
                  handleSubmitImg={this.handleSubmitImg}
                  {...this.props} // form
                />
              )}
            </ClientConsumer> */}
            <ClientConsumer>
              {rutClient => (
                <FingerprintAndSignature
                  client={this.state.client || null}
                  addFingerprintOrPenSignature={this.addFingerprintOrPenSignature}
                  handleSubmitImg={this.handleSubmitImg}
                  {...this.props.passProps}
                />
              )}
            </ClientConsumer>
          </div>
        </Modal>
      </Modal>
    )
  }
}

function arrayBufferToBase64(buffer) {
  let binary = ''
  let bytes = [].slice.call(new Uint8Array(buffer))

  bytes.forEach(b => (binary += String.fromCharCode(b)))

  return window.btoa(binary)
}

function b64toBlob(b64Data, contentType, sliceSize) {
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

function getOffset(el) {
  el = el.getBoundingClientRect()
  return {
    // left: el.left + window.scrollX,
    // top: el.top + window.scrollY
    left: el.left + document.documentElement.scrollLeft,
    top: el.top + document.documentElement.scrollTop
  }
}
