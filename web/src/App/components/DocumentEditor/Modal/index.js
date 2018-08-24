import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import { withRouter } from 'react-router'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import withGraphQL from 'react-apollo-decorators/lib/withGraphQL'
import gql from 'graphql-tag'
import { ClientConsumer } from '../context'
import Header from './Header'
import Pagination from './Pagination'
import Body from './Body'
import Form from './Form'
import apiUrl from '../helpers/url'
import styles from './styles.css'

@withRouter
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
    value: PropTypes.object,
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
    pdfFileName: '',
    pagesSrc: [],
    pages: [],
    activePage: 1,
    posX: 0,
    posY: 0,
    signatureImages: [],
    isOptionsMenuOpen: false,
    wsqKeys: []
  }

  toggleLoading = () => {
    this.setState({ loading: !this.state.loading })
  }

  resetState = () => {
    this.setState({
      size: 0,
      loading: false,
      file: null,
      filename: '',
      pdfFileName: '',
      pagesSrc: [],
      pages: [],
      activePage: 1,
      posX: 0,
      posY: 0,
      signatureImages: [],
      isOptionsMenuOpen: false,
      wsqKeys: []
    })
  }

  changeState = changes => this.setState({ ...changes })

  requestFileDeletion = () => {
    const splitFileName = this.state.pdfFileName.split('.')
    const fileName = `${splitFileName[0]}.${splitFileName[1]}`
    const body = { fileName, secret: 'sodlab_allow_delete' }

    fetch(`${apiUrl}/api/files`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })
  }

  closeOptionsMenu = () => this.setState({ isOptionsMenuOpen: false })

  render() {
    return (
      <Modal
        appElement={document.querySelector('#root')}
        id="pdfEditorModal"
        isOpen={this.props.isOpen}
        onRequestClose={() => this.props.onClose()}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Confirmación"
      >
        <Header
          value={this.props.value}
          passProps={this.props.passProps}
          environmentId={this.props.environmentId}
          selectOptions={this.props.selectOptions}
          showMessage={this.props.showMessage}
          errorMessage={this.props.errorMessage}
          filename={this.state.filename}
          pdfFileName={this.state.pdfFileName}
          requestFileDeletion={this.requestFileDeletion}
          resetState={this.resetState}
          toggleLoading={this.toggleLoading}
          fetchPdfImages={this.fetchPdfImages}
          changeState={this.changeState}
          pages={this.state.pages}
          pagesSrc={this.state.pagesSrc}
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
          pdfFileName={this.state.pdfFileName}
          size={this.state.size}
          generateUploadCredentials={this.props.generateUploadCredentials}
          onChange={this.props.onChange}
          completeUpload={this.props.completeUpload}
          showMessage={this.props.showMessage}
          onClose={this.props.onClose}
          pagesSrc={this.state.pagesSrc}
          activePage={this.state.activePage}
          updatePlaceholder={this.props.updatePlaceholder}
          wsqKeys={this.state.wsqKeys}
          collectionId={this.props.passProps.collectionId}
          wsqKeys={this.state.wsqKeys}
        />
        <Modal
          appElement={document.querySelector('#root')}
          id="pdfOptionsMenuModal"
          isOpen={this.state.isOptionsMenuOpen}
          onRequestClose={this.closeOptionsMenu}
          className={styles.optionsMenuModal}
          overlayClassName={styles.optionsMenuOverlay}
        >
          <div className={styles.btnContainer}>
            <ClientConsumer>
              {rutClient => (
                <Form
                  filename={this.state.filename}
                  insertImage={this.insertImage}
                  handleSubmitImg={this.handleSubmitImg}
                  changeState={this.changeState}
                  pdfFileName={this.state.pdfFileName}
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
                  wsqKeys={this.state.wsqKeys}
                />
              )}
            </ClientConsumer>
          </div>
        </Modal>
      </Modal>
    )
  }
}
