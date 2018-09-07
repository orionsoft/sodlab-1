import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import {ClientConsumer} from '../context'
import arrayBufferToBase64 from '../helpers/arrayBufferToBase64'
import Header from './Header'
import Pagination from './Pagination'
import Body from './Body'
import Form from './Form'
import apiUrl from '../helpers/url'
import styles from './styles.css'

@withGraphQL(gql`
  query getFormOneOfSelectOptions($environmentId: ID, $formId: ID, $fieldName: String) {
    selectOptions(environmentId: $environmentId, formId: $formId, fieldName: $fieldName) {
      label
      value
    }
  }
`)
@withMessage
export default class Main extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
    isOptionsMenuOpen: false,
    apiObjects: []
  }

  async componentDidMount() {
    if (this.props.value) {
      if (typeof this.props.value === 'string') {
        this.toggleLoading()
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
          console.log('data', data)
          this.setState({
            apiFilename: data.apiFilename,
            filename: name,
            pages: data.pages
          })
          this.fetchPdfPages()
        } catch (error) {
          this.props.showMessage('Error al procesar el archivo')
        }
      } else {
        this.toggleLoading()
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
          this.props.showMessage('Error al procesar el archivo')
        }
      }
    }
  }

  toggleLoading = () => {
    this.setState({loading: !this.state.loading})
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
      isOptionsMenuOpen: false,
      apiObjects: []
    })
  }

  changeState = changes => this.setState({...changes})

  fetchPdfPages = async () => {
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
        this.props.changeState({loading: false})
        this.props.showMessage('No se pudo completar la solicitud. Favor volver a intentarlo')
      }
    })
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

  closeOptionsMenu = () => this.setState({isOptionsMenuOpen: false})

  render() {
    return (
      <Modal
        appElement={document.querySelector('#root')}
        id="pdfEditorModal"
        isOpen={this.props.isOpen}
        onRequestClose={() => this.props.onClose()}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Confirmación">
        <Header
          passProps={this.props.passProps}
          environmentId={this.props.environmentId}
          showMessage={this.props.showMessage}
          errorMessage={this.props.errorMessage}
          filename={this.state.filename}
          apiFilename={this.state.apiFilename}
          requestFileDeletion={this.requestFileDeletion}
          resetState={this.resetState}
          toggleLoading={this.toggleLoading}
          fetchPdfPages={this.fetchPdfPages}
          changeState={this.changeState}
          pages={this.state.pages}
          pagesSrc={this.state.pagesSrc}
          apiObjects={this.state.apiObjects}
        />
        <Pagination
          loading={this.state.loading}
          pagesSrc={this.state.pagesSrc}
          activePage={this.state.activePage}
          changeState={this.changeState}
        />
        <Body
          loading={this.state.loading}
          signatureImages={this.state.signatureImages}
          changeState={this.changeState}
          resetState={this.resetState}
          requestFileDeletion={this.requestFileDeletion}
          filename={this.state.filename}
          apiFilename={this.state.apiFilename}
          size={this.state.size}
          generateUploadCredentials={this.props.generateUploadCredentials}
          onChange={this.props.onChange}
          completeUpload={this.props.completeUpload}
          showMessage={this.props.showMessage}
          onClose={this.props.onClose}
          pagesSrc={this.state.pagesSrc}
          activePage={this.state.activePage}
          updatePlaceholder={this.props.updatePlaceholder}
          apiObjects={this.state.apiObjects}
          collectionId={this.props.passProps.collectionId}
        />
        <Modal
          appElement={document.querySelector('#root')}
          id="pdfOptionsMenuModal"
          isOpen={this.state.isOptionsMenuOpen}
          onRequestClose={this.closeOptionsMenu}
          className={styles.optionsMenuModal}
          overlayClassName={styles.optionsMenuOverlay}>
          <div className={styles.btnContainer}>
            <ClientConsumer>
              {rutClient => (
                <Form
                  filename={this.state.filename}
                  insertImage={this.insertImage}
                  handleSubmitImg={this.handleSubmitImg}
                  changeState={this.changeState}
                  apiFilename={this.state.apiFilename}
                  pages={this.state.pages}
                  pagesSrc={this.state.pagesSrc}
                  signatureImages={this.state.signatureImages}
                  activePage={this.state.activePage}
                  posX={this.state.posX}
                  posY={this.state.posY}
                  showMessage={this.props.showMessage}
                  formId={this.props.passProps.formId}
                  collectionId={this.props.passProps.collectionId}
                  valueKey={this.props.passProps.valueKey}
                  fieldName={this.props.fieldName}
                  passProps={this.props.passProps}
                  apiObjects={this.state.apiObjects}
                />
              )}
            </ClientConsumer>
          </div>
        </Modal>
      </Modal>
    )
  }
}
