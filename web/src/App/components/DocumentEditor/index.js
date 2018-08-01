import React from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import cleanFileURL from './helpers/cleanFileUrl'
import styles from './styles.css'
import {ClientProvider} from './context'
import {withRouter} from 'react-router'

@withRouter
export default class DocumentEditor extends React.Component {
  static propTypes = {
    router: PropTypes.object,
    value: PropTypes.object,
    placeholder: PropTypes.node,
    upload: PropTypes.func.isRequired,
    delete: PropTypes.func,
    passProps: PropTypes.object,
    fieldName: PropTypes.string,
    environmentId: PropTypes.string
  }

  static defaultProps = {
    placeholder: 'PROCESAR DOCUMENTO'
  }

  state = {
    modalIsOpen: false
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
  }

  closeModal = () => {
    this.setState({modalIsOpen: false})
  }

  renderPlaceholderOrName() {
    if (this.props.value) {
      const clean = cleanFileURL(this.props.value.url)
      const pdfFileName = clean.split('.')[1]
      return pdfFileName
    } else {
      return this.props.placeholder
    }
  }

  render() {
    return (
      <div>
        <ClientProvider value={'holanda'}>
          <Modal
            appElement={document.querySelector('#root')}
            isOpen={this.state.modalIsOpen}
            onClose={this.closeModal}
            {...this.props}
          />
          <div onClick={this.openModal} className={styles.button}>
            {this.renderPlaceholderOrName()}
          </div>
        </ClientProvider>
      </div>
    )
  }
}
