import React from 'react'
import PropTypes from 'prop-types'
import {MdNoteAdd} from 'react-icons/lib/md'
import autobind from 'autobind-decorator'
import apiUrl from 'App/components/DocumentEditor/helpers/url'
import requestUniqueId from 'App/components/DocumentEditor/helpers/requestUniqueId'
import requestSignedUrl from 'App/components/DocumentEditor/helpers/requestSignedUrl'
import uploadFile from 'App/components/DocumentEditor/helpers/uploadFile'
import styles from './styles.css'

export default class DocumentEditorHeader extends React.Component {
  static propTypes = {
    showMessage: PropTypes.func,
    passProps: PropTypes.object,
    environmentId: PropTypes.string,
    selectOptions: PropTypes.array,
    errorMessage: PropTypes.func,
    filename: PropTypes.string,
    apiFilename: PropTypes.string,
    requestFileDeletion: PropTypes.func,
    resetState: PropTypes.func,
    toggleLoading: PropTypes.func,
    fetchPdfPages: PropTypes.func,
    changeState: PropTypes.func,
    pages: PropTypes.array,
    pagesSrc: PropTypes.array,
    apiObjects: PropTypes.array,
    envId: PropTypes.string
  }

  @autobind
  async submit() {
    const {envId} = this.props
    // if (this.props.apiFilename) {
    //   this.props.requestFileDeletion()
    // }

    // if (this.props.apiObjects.length > 0) {
    //   this.props.apiObjects.map(object => localStorage.removeItem(object.fileId))
    //   if (localStorage.getItem('fingerprintPng')) {
    //     localStorage.removeItem('fingerprintPng')
    //   }
    // }
    this.props.resetState()
    this.props.changeState({loading: true})

    try {
      const file = document.getElementById('pdf_file').files[0]
      const size = file.size
      const filename = file.name.replace(/ /g, '_')
      const uniqueId = await requestUniqueId()
      const params = {
        bucket: 'work',
        key: `${envId}/${uniqueId}/${filename}`,
        operation: 'putObject',
        contentType: 'application/pdf'
      }
      const signedRequest = await requestSignedUrl(params)
      await uploadFile(signedRequest, file, params.contentType)
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({envId, uniqueId, filename})
      }
      const response = await fetch(`${apiUrl}/api/documents/getPages`, options)
      const {pagesData, Objects} = await response.json()

      this.props.changeState({
        filename,
        pages: pagesData,
        size,
        uniqueId,
        objects: Objects
      })
      return this.props.fetchPdfPages()
    } catch (error) {
      console.log(error)
      this.props.showMessage('Error al procesar el archivo')
    }
  }

  renderUploadButton() {
    return (
      <div>
        <input type="file" id="pdf_file" accept=".pdf" onChange={this.submit} />
        <label htmlFor="pdf_file">
          <MdNoteAdd />
          CARGAR DOCUMENTO
        </label>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.headerContainer}>
        <span>{this.props.filename.toUpperCase() || 'NO SE HA SELECCIONADO NINGÚN DOCUMENTO'}</span>
        <div className={styles.headerOptions}>
          <div className={styles.headerInputContainer}>{this.renderUploadButton()}</div>
        </div>
      </div>
    )
  }
}
