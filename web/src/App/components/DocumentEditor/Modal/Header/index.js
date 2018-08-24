import React from 'react'
import PropTypes from 'prop-types'
import Select from 'orionsoft-parts/lib/components/fields/Select'
import { MdNoteAdd } from 'react-icons/lib/md'
import apiUrl from '../../helpers/url'
import arrayBufferToBase64 from '../../helpers/arrayBufferToBase64'
import styles from './styles.css'

export default class DocumentEditorHeader extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    showMessage: PropTypes.func,
    passProps: PropTypes.object,
    environmentId: PropTypes.string,
    selectOptions: PropTypes.array,
    errorMessage: PropTypes.func,
    filename: PropTypes.string,
    pdfFileName: PropTypes.string,
    requestFileDeletion: PropTypes.func,
    resetState: PropTypes.func,
    toggleLoading: PropTypes.func,
    fetchPdfImages: PropTypes.func,
    changeState: PropTypes.func,
    pages: PropTypes.array,
    pagesSrc: PropTypes.array
  }

  fetchPdfPages = () => {
    this.props.pages.forEach(async (fileInfo, index) => {
      const randomNumber = Math.floor(Math.random() * 10000)
      try {
        const response = await fetch(`${apiUrl}/api/images/pdf/${fileInfo.name}/${randomNumber}`)
        const buffer = await response.arrayBuffer()
        const base64Flag = 'data:image/png;base64,'
        const imageStr = arrayBufferToBase64(buffer)
        const src = base64Flag + imageStr
        const pagesSrc = [...this.props.pagesSrc, { name: fileInfo.name, src, index }].sort(
          (a, b) => a.index - b.index
        )

        return this.props.changeState({
          pagesSrc,
          loading: false
        })
      } catch (err) {
        this.props.changeState({ loading: false })
        this.props.showMessage('No se pudo completar la solicitud. Favor volver a intentarlo')
      }
    })
  }

  submit = async () => {
    if (this.props.pdfFileName) {
      this.props.requestFileDeletion()
    }

    this.props.resetState()
    // !! check localstorage in clear it if needed
    this.props.toggleLoading()

    try {
      const file = document.getElementById('pdf_file').files[0]
      const form = document.createElement('form')
      const size = file.size
      form.enctype = 'multipart/form-data'
      const formData = new FormData(form)
      const date = new Date()
      const filename = file.name.replace(/ /g, '_')
      const pdfFileName = date.getTime().toString() + '.' + filename
      formData.append('pdf_upload', file, pdfFileName)
      const response = await fetch(`${apiUrl}/api/pdf`, {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      this.props.changeState({
        pdfFileName,
        filename,
        pages: data.message,
        size
      })
      return this.fetchPdfPages()
    } catch (error) {
      this.props.showMessage('Error al subir al procesar el archivo')
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
          {/* <div className={styles.headerSelectContainer}>
            <Select
              value={this.props.client && this.props.client[this.props.passProps.valueKey]}
              onChange={change =>
                this.props.changeState({ client: { [this.props.passProps.valueKey]: change } })
              }
              options={this.props.selectOptions}
              errorMessage={this.props.errorMessage}
              {...this.props.passProps}
            />
          </div> */}
          <div className={styles.headerInputContainer}>{this.renderUploadButton()}</div>
        </div>
      </div>
    )
  }
}
