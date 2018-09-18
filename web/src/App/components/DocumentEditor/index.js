import React from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import styles from './styles.css'
import {ClientProvider} from './context'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import apiUrl from './helpers/url'
import arrayBufferToBase64 from './helpers/arrayBufferToBase64'

@withMessage
export default class DocumentEditor extends React.Component {
  static propTypes = {
    fieldName: PropTypes.string,
    onChange: PropTypes.func,
    passProps: PropTypes.object,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    showMessage: PropTypes.func
  }

  state = {
    modalIsOpen: false,
    placeholder: '',
    client: null,
    loading: false,
    filename: '',
    size: 0,
    apiFilename: '',
    pagesSrc: [],
    pages: [],
    activePage: 1,
    posX: 0,
    posY: 0,
    signatureImages: [],
    apiObjects: []
  }

  resetState = () => {
    this.setState({
      size: 0,
      loading: false,
      file: null,
      filename: '',
      apiFilename: '',
      pagesSrc: [],
      pages: [],
      activePage: 1,
      posX: 0,
      posY: 0,
      signatureImages: [],
      apiObjects: []
    })
  }

  changeState = changes => this.setState({...changes})

  openModal = () => {
    this.setState({modalIsOpen: true})
    if (this.props.value) {
      this.props.showMessage('Comenzando la carga del documento')
      this.loadDocument()
    }
  }

  closeModal = () => {
    setTimeout(() => {
      this.setState({modalIsOpen: false})
    }, 1)
  }

  requestFileDeletion = () => {
    const fileName = this.state.apiFilename

    fetch(`${apiUrl}/api/files`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({fileName, secret: 'sodlab_allow_delete'})
    })
    if (this.state.apiObjects.length > 0) {
      fetch(`${apiUrl}/api/objects`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({apiObjects: this.state.apiObjects, secret: 'sodlab_allow_delete'})
      })
    }
  }

  onClose = () => {
    this.requestFileDeletion()
    this.resetState()
    this.closeModal()
  }

  updatePlaceholder = placeholder => {
    this.setState({placeholder})
  }

  async loadDocument() {
    if (typeof this.props.value === 'string') {
      this.setState({loading: true})
      const url = this.props.value
      const params = url.replace('https://s3.amazonaws.com/', '').split('/')
      const bucket = params.splice(0, 1)[0]
      const key = params.join('/')
      const name = key
        .split('-')
        .filter((item, index) => index !== 0)
        .join('-')

      try {
        const response = await fetch(`${apiUrl}/api/files/aws/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({bucket, key})
        })
        const data = await response.json()

        this.setState({
          apiFilename: data.apiFilename,
          filename: name,
          pages: data.pages
        })
        this.fetchPdfPages()
      } catch (error) {
        this.props.showMessage('Error al cargar el archivo')
      }
    } else {
      this.setState({loading: true})
      const {bucket, key, name, size} = this.props.value
      try {
        const response = await fetch(`${apiUrl}/api/files/aws/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: JSON.stringify({bucket, key})
        })
        const data = await response.json()
        this.setState({
          apiFilename: data.apiFilename,
          filename: name,
          pages: data.pages,
          size
        })
        this.fetchPdfPages()
      } catch (error) {
        this.props.showMessage('Error al cargar el archivo')
      }
    }
  }

  fetchPdfPages = () => {
    this.state.pages.map(async (page, index) => {
      try {
        const response = await fetch(`${apiUrl}/api/images/pdf/${page.name}/${index}`)
        const buffer = await response.arrayBuffer()
        const base64Flag = 'data:image/png;base64,'
        const imageStr = arrayBufferToBase64(buffer)
        const src = base64Flag + imageStr
        const pagesSrc = [...this.state.pagesSrc, {name: page.name, src, index}].sort(
          (a, b) => a.index - b.index
        )

        return this.setState({
          pagesSrc,
          loading: false
        })
      } catch (err) {
        this.setState({loading: false})
        this.props.showMessage('No se pudo completar la solicitud. Favor volver a intentarlo')
      }
    })
  }

  renderNoValue(value) {
    return <div className={styles.noValue}>{value}</div>
  }

  renderValue(value) {
    return (
      <div>
        <div className={styles.valueContainer}>
          <div className={styles.name}>{value}</div>
        </div>
      </div>
    )
  }

  renderFieldValue() {
    if (this.state.placeholder) {
      return this.renderNoValue(this.state.placeholder)
    } else if (this.props.value) {
      if (typeof this.props.value === 'string') {
        const name = this.props.value
          .split('/')[5]
          .split('-')
          .filter((item, index) => index !== 0)
          .join('-')

        return this.renderValue(name)
      } else if (typeof this.props.value === 'object') {
        return this.renderValue(this.props.value.name)
      }
    } else {
      return this.renderNoValue('Generar Documento')
    }
  }

  render() {
    const {modalIsOpen, ...rest} = this.state
    return (
      <div>
        <ClientProvider>
          <Modal
            appElement={document.querySelector('#root')}
            isOpen={modalIsOpen}
            onClose={this.onClose}
            formId={this.props.passProps.formId}
            updatePlaceholder={this.updatePlaceholder}
            resetState={this.resetState}
            changeState={this.changeState}
            fetchPdfPages={this.fetchPdfPages}
            requestFileDeletion={this.requestFileDeletion}
            {...this.props}
            {...rest}
          />
          <div onClick={this.openModal} className={styles.container}>
            <div className={styles.placeholderContainer}>{this.renderFieldValue()}</div>
          </div>
        </ClientProvider>
      </div>
    )
  }
}
