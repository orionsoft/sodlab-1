import React from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import { FaSpinner } from 'react-icons/lib/fa'
import { MdFileDownload } from 'react-icons/lib/md'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import Button from 'orionsoft-parts/lib/components/Button'
import apiUrl from '../../helpers/url'
import styles from './styles.css'

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
export default class DocumentEditorPagination extends React.Component {
  static propTypes = {
    loading: PropTypes.bool,
    signatureImages: PropTypes.array,
    changeState: PropTypes.func,
    resetState: PropTypes.func,
    requestFileDeletion: PropTypes.func,
    filename: PropTypes.string,
    pdfFileName: PropTypes.string,
    size: PropTypes.number,
    generateUploadCredentials: PropTypes.func,
    onChange: PropTypes.func,
    completeUpload: PropTypes.func,
    showMessage: PropTypes.func,
    pagesSrc: PropTypes.array,
    wsqKeys: PropTypes.array,
    collectionId: PropTypes.string
  }

  setActiveSignature = e => {
    const data = e.currentTarget.alt.split('/')
    const id = data[0]
    const name = data[1]
    const rut = data[2]
    const imageSrc = e.currentTarget.src
    const newState = {
      activeSignature: { id, imageSrc, name, rut }
    }
    this.props.changeState(newState)
  }

  getOffset(el) {
    el = el.getBoundingClientRect()
    return {
      left: el.left + document.documentElement.scrollLeft,
      top: el.top + document.documentElement.scrollTop
    }
  }

  handleImageClick = e => {
    const img = document.getElementById('pdfImage')
    const { left, top } = this.getOffset(img)
    const imgWidth = img.width
    const imgHeight = img.height
    const dX = e.pageX - left
    const dY = top + imgHeight - e.pageY
    const dXPercentage = dX / imgWidth
    const dYPercentage = dY / imgHeight

    this.props.changeState({
      posX: dXPercentage,
      posY: dYPercentage,
      isOptionsMenuOpen: true
    })
  }

  handleDownloadPdf = () => {
    const pdfFileName = this.props.pdfFileName.split('.')
    const filename = `${pdfFileName[1]}.${pdfFileName[2]}`
    fetch(`${apiUrl}/api/pdf/${this.props.pdfFileName}`)
      .then(response => response.blob())
      .then(blob => FileSaver.saveAs(blob, filename))
      .catch(err => this.props.showMessage('No se ha podido descargar el archivo'))
  }

  requestCredentials = async body => {
    try {
      const { result } = await this.props.generateUploadCredentials({
        name: body.fileName,
        size: this.props.size,
        type: body.fileType
      })
      return result
    } catch (error) {
      this.props.showMessage('Error al generar crendenciales únicas para el documento')
    }
  }

  complete = async fileId => {
    this.props.onChange({ _id: fileId })
    try {
      return await this.props.completeUpload({ fileId })
    } catch (error) {
      this.props.showMessage('Error al generar credenciales')
    }
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

    let blob = new Blob(byteArrays, { type: contentType })
    return blob
  }

  appendDataToForm = (type, signature, formData) => {
    if (typeof signature === 'undefined' || signature === null) return

    const block = signature.imageSrc.split(';')
    const contentType = block[0].split(':')[1]
    const realData = block[1].split(',')[1]
    const blob = this.b64toBlob(realData, contentType)
    const imageIdArray = signature.id.split('.')
    const identifier = type === '' ? imageIdArray[imageIdArray.length - 1] : type
    formData.append(identifier, blob, signature.id)
    formData.append(identifier, identifier)
    formData.append('signer_name', signature.name)
    formData.append('signer_rut', signature.rut)
    return
  }

  sendBiometricObjects = async s3key => {
    const environmentId = this.props.collectionId.split('_')[0]
    const docId = s3key.split('/')[1].split('-')[0]

    try {
      const form = document.createElement('form')
      form.enctype = 'multipart/form-data'
      const formData = new FormData(form)
      formData.append('environmentId', environmentId)
      formData.append('docId', docId)

      this.props.wsqKeys.forEach((key, index) => {
        const wsqBase64 = localStorage.getItem(key)
        const block = wsqBase64.split(';')
        const contentType = block[0].split(':')[1]
        const realData = block[1].split(',')[1]
        const blob = this.b64toBlob(realData, contentType)
        const filename = `${key}_${index}.wsq`

        formData.append(filename, blob, filename)
        localStorage.removeItem(key)
      })
      await fetch(`${apiUrl}/api/objects`, {
        method: 'POST',
        body: formData
      })
      return
    } catch (err) {
      return this.props.showMessage('Error al subir los archivos biomentricos')
    }
  }

  handleConfirm = async () => {
    const fileData = {
      fileName: this.props.pdfFileName,
      fileType: 'application/pdf'
    }
    try {
      const credentials = await this.requestCredentials(fileData)
      const body = { ...fileData, ...credentials }
      await this.complete(credentials.fileId)
      const response = await fetch(`${apiUrl}/api/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (data.success) {
        this.props.updatePlaceholder(this.props.filename)
        this.props.showMessage('Documento guardado con éxito. Guardando información biometrica')
        await this.sendBiometricObjects(body.key)
        this.props.showMessage('Información biometrica guardada con éxito')
        this.handleClose()
      }
    } catch (error) {
      this.props.showMessage('Error al guardar documento')
    }
  }

  handleClose = () => {
    this.props.onClose()
    this.props.requestFileDeletion()
    this.props.resetState()
  }

  renderSignatureImages = () => {
    return this.props.signatureImages.map((image, index) => {
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

  renderActivePage = () => {
    if (this.props.pagesSrc.length > 0) {
      return (
        <img
          id="pdfImage"
          src={this.props.pagesSrc[this.props.activePage - 1].src}
          alt=""
          onClick={this.handleImageClick}
          width="500"
        />
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <div className={styles.editorContainer}>
        <div className={styles.pdfImageContainer}>
          {this.props.loading ? (
            <div className={styles.loaderContainer}>
              <FaSpinner className={styles.iconSpinBig} />
            </div>
          ) : (
            this.renderActivePage()
          )}
        </div>
        <div className={styles.imagesContainer}>{this.renderSignatureImages()}</div>
        <div className={styles.optionsContainer}>
          <div>
            <Button
              linkButton={false}
              label={'descargar'}
              primary={true}
              danger={false}
              big={false}
              onClick={this.handleDownloadPdf}
            />
          </div>
          <div>
            <Button
              linkButton={false}
              label={'confirmar'}
              primary={true}
              danger={false}
              big={false}
              onClick={this.handleConfirm}
            />
          </div>
          <div>
            <Button
              linkButton={false}
              label={'cerrar'}
              primary={false}
              danger={true}
              big={false}
              onClick={this.handleClose}
            />
          </div>
        </div>
      </div>
    )
  }
}
