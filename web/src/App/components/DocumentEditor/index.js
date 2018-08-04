import React from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import styles from './styles.css'
import { ClientProvider } from './context'
import { withRouter } from 'react-router'

@withRouter
export default class DocumentEditor extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    onChange: PropTypes.func,
    value: PropTypes.object,
    placeholder: PropTypes.node,
    upload: PropTypes.func,
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
    this.setState({ modalIsOpen: true })
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false })
  }

  renderPlaceholderOrName() {
    if (this.props.value) {
      return 'Subido'
    } else {
      return this.props.placeholder
    }
  }

  render() {
    return (
      <div>
        <ClientProvider>
          <Modal
            appElement={document.querySelector('#root')}
            isOpen={this.state.modalIsOpen}
            onClose={this.closeModal}
            {...this.props}
            {...this.props.passProps}
          />
          <div onClick={this.openModal} className={styles.button}>
            {this.renderPlaceholderOrName()}
          </div>
        </ClientProvider>
      </div>
    )
  }
}
