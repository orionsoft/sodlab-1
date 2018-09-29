import React from 'react'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import Modal from './Modal'
import styles from './styles.css'
import {ClientProvider} from './context'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import apiUrl from './helpers/url'
import downloadImage from './helpers/downloadImage'

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
    size: 0,
    apiFilename: '',
    pagesSrc: [],
    pages: [],
    activePage: 1,
    posX: 0,
    posY: 0,
    signatureImages: [],
    apiObjects: [],
    isOptionsMenuOpen: false,
    uniqueId: '',
    envId: '',
    filename: '',
    objects: []
  }

  componentDidMount() {
    const envId = this.props.passProps.collectionId.split('_')[0]
    this.setState({envId})
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
      apiObjects: [],
      uniqueId: '',
      envId: '',
      filename: '',
      objects: []
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

  @autobind
  requestFileDeletion() {
    const {envId, uniqueId} = this.state

    return fetch(`${apiUrl}/api/others/deleteFolder`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({Prefix: `${envId}/${uniqueId}`})
    })
  }

  @autobind
  onClose() {
    this.requestFileDeletion()
    this.resetState()
    this.closeModal()
  }

  @autobind
  async copyDocumentToWorkBucket(key, envId, filename) {
    try {
      const copyResponse = await fetch(`${apiUrl}/api/documents/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({key, envId, filename})
      })
      const {uniqueId, size} = await copyResponse.json()

      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify({envId, uniqueId, filename})
      }
      const response = await fetch(`${apiUrl}/api/documents/getPages`, options)
      const {pagesData, Objects} = await response.json()

      this.setState({
        uniqueId,
        size,
        envId,
        pages: pagesData,
        objects: Objects
      })
      this.fetchPdfPages()
    } catch (error) {
      this.props.showMessage('Error al cargar el archivo')
    }
  }

  @autobind
  async loadDocument() {
    const envId = this.props.passProps.collectionId.split('_')[0]
    const {value} = this.props

    if (typeof value === 'string') {
      this.setState({loading: true})
      const url = value
      const params = url
        .replace('https://s3.amazonaws.com/', '')
        .split('/')
        .slice(1)
      const key = params.join('/')
      const filename = key
        .split('-')
        .filter((item, index) => index !== 0)
        .join('-')
      this.setState({filename})
      this.copyDocumentToWorkBucket(key, envId, filename)
    } else if (typeof this.props.value === 'object') {
      if (!value.hasOwnProperty('key') || !value.hasOwnProperty('name')) return

      this.setState({loading: true})
      const {key, name} = this.props.value

      this.copyDocumentToWorkBucket(key, envId, name)
    } else {
      return
    }
  }

  @autobind
  fetchPdfPages() {
    this.state.pages.map(async page => {
      try {
        const params = {
          bucket: 'work',
          key: `${this.state.envId}/${this.state.uniqueId}/${page.name}`,
          operation: 'getObject'
        }
        const index = parseInt(page.name.split('.')[2].replace('_', '')) - 1
        const src = await downloadImage(params)
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
