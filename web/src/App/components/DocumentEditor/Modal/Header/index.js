import React from 'react'
import PropTypes from 'prop-types'
import {MdNoteAdd} from 'react-icons/lib/md'
import apiUrl from '../../helpers/url'
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
    apiObjects: PropTypes.array
  }

  submit = async () => {
    if (this.props.apiFilename) {
      this.props.requestFileDeletion()
    }

    if (this.props.apiObjects.length > 0) {
      this.props.apiObjects.map(object => localStorage.removeItem(object.fileId))
      if (localStorage.getItem('fingerprintPng')) {
        localStorage.removeItem('fingerprintPng')
      }
    }
    this.props.resetState()
    this.props.toggleLoading()

    try {
      const file = document.getElementById('pdf_file').files[0]
      const form = document.createElement('form')
      const size = file.size
      form.enctype = 'multipart/form-data'
      const formData = new FormData(form)
      const filename = file.name.replace(/ /g, '_')
      formData.append('pdf_upload', file)
      const response = await fetch(`${apiUrl}/api/pdf`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      this.props.changeState({
        apiFilename: data.apiFilename,
        filename,
        pages: data.pages,
        size
      })
      return this.props.fetchPdfPages()
    } catch (error) {
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
