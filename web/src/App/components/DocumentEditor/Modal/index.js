import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import withMessage from 'orionsoft-parts/lib/decorators/withMessage'
import {ClientConsumer} from '../context'
import Header from './Header'
import Pagination from './Pagination'
import Body from './Body'
import Form from './Form'
import styles from './styles.css'

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
    completeUpload: PropTypes.func,
    client: PropTypes.object,
    loading: PropTypes.bool,
    filename: PropTypes.string,
    size: PropTypes.number,
    apiFilename: PropTypes.string,
    pagesSrc: PropTypes.array,
    pages: PropTypes.array,
    activePage: PropTypes.number,
    posX: PropTypes.number,
    posY: PropTypes.number,
    signatureImages: PropTypes.array,
    apiObjects: PropTypes.array,
    isOptionsMenuOpen: PropTypes.bool,
    fetchPdfPages: PropTypes.func,
    requestFileDeletion: PropTypes.func,
    resetState: PropTypes.func,
    changeState: PropTypes.func
  }

  closeOptionsMenu = () => {
    this.props.changeState({isOptionsMenuOpen: false})
  }

  render() {
    return (
      <Modal
        appElement={document.querySelector('#root')}
        id="pdfEditorModal"
        isOpen={this.props.isOpen}
        onRequestClose={this.props.onClose}
        className={styles.modal}
        overlayClassName={styles.overlay}
        contentLabel="Confirmación">
        <Header
          loading={this.props.loading}
          passProps={this.props.passProps}
          environmentId={this.props.environmentId}
          showMessage={this.props.showMessage}
          errorMessage={this.props.errorMessage}
          filename={this.props.filename}
          apiFilename={this.props.apiFilename}
          requestFileDeletion={this.props.requestFileDeletion}
          resetState={this.props.resetState}
          fetchPdfPages={this.props.fetchPdfPages}
          changeState={this.props.changeState}
          pages={this.props.pages}
          pagesSrc={this.props.pagesSrc}
          apiObjects={this.props.apiObjects}
        />
        <Pagination
          loading={this.props.loading}
          pagesSrc={this.props.pagesSrc}
          activePage={this.props.activePage}
          changeState={this.props.changeState}
        />
        <Body
          loading={this.props.loading}
          signatureImages={this.props.signatureImages}
          changeState={this.props.changeState}
          resetState={this.props.resetState}
          requestFileDeletion={this.props.requestFileDeletion}
          filename={this.props.filename}
          apiFilename={this.props.apiFilename}
          size={this.props.size}
          generateUploadCredentials={this.props.generateUploadCredentials}
          onChange={this.props.onChange}
          completeUpload={this.props.completeUpload}
          showMessage={this.props.showMessage}
          onClose={this.props.onClose}
          pagesSrc={this.props.pagesSrc}
          activePage={this.props.activePage}
          updatePlaceholder={this.props.updatePlaceholder}
          apiObjects={this.props.apiObjects}
          collectionId={this.props.passProps.collectionId}
        />
        <Modal
          appElement={document.querySelector('#root')}
          id="pdfOptionsMenuModal"
          isOpen={this.props.isOptionsMenuOpen}
          onRequestClose={this.closeOptionsMenu}
          className={styles.optionsMenuModal}
          overlayClassName={styles.optionsMenuOverlay}>
          <div className={styles.btnContainer}>
            <ClientConsumer>
              {rutClient => (
                <Form
                  filename={this.props.filename}
                  insertImage={this.insertImage}
                  handleSubmitImg={this.handleSubmitImg}
                  changeState={this.props.changeState}
                  apiFilename={this.props.apiFilename}
                  pages={this.props.pages}
                  pagesSrc={this.props.pagesSrc}
                  signatureImages={this.props.signatureImages}
                  activePage={this.props.activePage}
                  posX={this.props.posX}
                  posY={this.props.posY}
                  showMessage={this.props.showMessage}
                  formId={this.props.passProps.formId}
                  collectionId={this.props.passProps.collectionId}
                  valueKey={this.props.passProps.valueKey}
                  fieldName={this.props.fieldName}
                  passProps={this.props.passProps}
                  apiObjects={this.props.apiObjects}
                />
              )}
            </ClientConsumer>
          </div>
        </Modal>
      </Modal>
    )
  }
}
