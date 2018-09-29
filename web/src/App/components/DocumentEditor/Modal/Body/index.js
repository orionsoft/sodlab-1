import React from 'react'
import PropTypes from 'prop-types'
import FileSaver from 'file-saver'
import autobind from 'autobind-decorator'
import {FaSpinner} from 'react-icons/lib/fa'
import withMutation from 'react-apollo-decorators/lib/withMutation'
import gql from 'graphql-tag'
import Button from 'orionsoft-parts/lib/components/Button'
import requestSignedUrl from 'App/components/DocumentEditor/helpers/requestSignedUrl'
import apiUrl from 'App/components/DocumentEditor/helpers/url'
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
    collectionId: PropTypes.string,
    envId: PropTypes.string,
    uniqueId: PropTypes.string
  }

  getOffset(el) {
    el = el.getBoundingClientRect()
    return {
      left: el.left + document.documentElement.scrollLeft,
      top: el.top + document.documentElement.scrollTop
    }
  }

  @autobind
  handleImageClick(e) {
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

  @autobind
  async handleDownloadPdf() {
    const {envId, uniqueId, filename} = this.props
    try {
      const params = {
        bucket: 'work',
        key: `${envId}/${uniqueId}/${filename}`,
        operation: 'getObject'
      }
      const signedUrl = await requestSignedUrl(params)
      const response = await fetch(signedUrl)
      const blob = await response.blob()
      FileSaver.saveAs(blob, filename)
    } catch (error) {
      this.props.showMessage('Ha ocurrido al descargar el archivo. Por favor intentelo nuevamente')
    }
  }

  @autobind
  async requestCredentials(body) {
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

  @autobind
  async complete(fileId) {
    this.props.onChange({_id: fileId})
    try {
      return await this.props.completeUpload({fileId})
    } catch (error) {
      this.props.showMessage('Error al generar credenciales')
    }
  }

  @autobind
  async handleConfirm() {
    const {envId, uniqueId, filename} = this.props
    try {
      const fileData = {
        fileName: filename,
        fileType: 'application/pdf'
      }
      const credentials = await this.requestCredentials(fileData)
      const key = credentials.key.replace('.pdf', '')
      const body = {
        envId,
        uniqueId,
        filename,
        key
      }
      const response = await fetch(`${apiUrl}/api/others/wrapUp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(body)
      })
      const data = await response.json()
      if (data.success) {
        await this.complete(credentials.fileId)
        this.props.updatePlaceholder(filename)
        this.props.showMessage('Documento guardado con éxito')
        this.props.onClose()
      }
    } catch (error) {
      this.props.showMessage('Error al guardar documento')
    }
  }

  @autobind
  renderSignatureImages() {
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

  @autobind
  renderHelpMessage() {
    if (this.props.pagesSrc.length > 0) {
      return (
        <div className={styles.pdfImageHelpContainer}>
          <span>
            Haga click en la sección del documento en la que desee insertar la firma o huella
          </span>
        </div>
      )
    } else {
      return null
    }
  }

  @autobind
  renderActivePage() {
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
          {this.renderHelpMessage()}
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
              onClick={this.props.onClose}
            />
          </div>
        </div>
      </div>
    )
  }
}
