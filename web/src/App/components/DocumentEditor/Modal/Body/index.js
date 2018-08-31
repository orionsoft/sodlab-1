import React from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import {FaSpinner} from 'react-icons/lib/fa'
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
    apiFilename: PropTypes.string,
    size: PropTypes.number,
    generateUploadCredentials: PropTypes.func,
    onChange: PropTypes.func,
    completeUpload: PropTypes.func,
    showMessage: PropTypes.func,
    pagesSrc: PropTypes.array,
    apiObjects: PropTypes.array,
    collectionId: PropTypes.string
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
    const {left, top} = this.getOffset(img)
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
    fetch(`${apiUrl}/api/pdf/${this.props.apiFilename}`)
      .then(response => response.blob())
      .then(blob => FileSaver.saveAs(blob, this.props.filename))
      .catch(err => this.props.showMessage('No se ha podido descargar el archivo'))
  }

  requestCredentials = async body => {
    try {
      const {result} = await this.props.generateUploadCredentials({
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
    this.props.onChange({_id: fileId})
    try {
      return await this.props.completeUpload({fileId})
    } catch (error) {
      this.props.showMessage('Error al generar credenciales')
    }
  }

  sendBiometricObjects = async (timestamp, environmentId, docId) => {
    try {
      const body = {
        timestamp,
        environmentId,
        docId,
        paths: this.props.apiObjects
      }
      return await fetch(`${apiUrl}/api/objects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
      })
    } catch (error) {
      return this.props.showMessage('Error al subir los archivos biometricos')
    }
  }

  handleConfirm = async () => {
    const fileData = {
      fileName: this.props.filename,
      fileType: 'application/pdf'
    }
    const date = new Date()
    const timestamp = date.getTime().toString()
    try {
      const credentials = await this.requestCredentials(fileData)
      const environmentId = this.props.collectionId.split('_')[0]
      const docId = credentials.key.split('/')[1].split('-')[0]
      const body = {
        ...fileData,
        ...credentials,
        apiFilename: this.props.apiFilename
      }
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
        await this.sendBiometricObjects(timestamp, environmentId, docId)
        this.props.showMessage('Información biometrica guardada con éxito')
        this.handleClose()
      }
    } catch (error) {
      this.props.showMessage('Error al guardar documento')
    }
  }

  handleClose = async () => {
    this.props.requestFileDeletion()
    this.props.resetState()
    this.props.onClose()
  }

  renderSignatureImages = () => {
    return this.props.signatureImages.map((image, index) => {
      return (
        <div key={index}>
          <img
            id={`${image.id}.${image.name}`}
            src={image.imageSrc}
            alt={`${image.id}/${image.name}/${image.rut}`}
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
        <div className={styles.imagesContainer}>{this.renderSignatureImages()}</div>
        <div className={styles.pdfImageContainer}>
          {this.props.loading ? (
            <div className={styles.loaderContainer}>
              <FaSpinner className={styles.iconSpinBig} />
            </div>
          ) : (
            this.renderActivePage()
          )}
        </div>
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
