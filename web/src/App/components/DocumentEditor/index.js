import React from 'react'
import PropTypes from 'prop-types'
import Modal from './Modal'
import styles from './styles.css'
import {ClientProvider} from './context'
import {withRouter} from 'react-router'

@withRouter
export default class DocumentEditor extends React.Component {
  static propTypes = {
    fieldName: PropTypes.string,
    history: PropTypes.object,
    location: PropTypes.object,
    match: PropTypes.object,
    onChange: PropTypes.func,
    passProps: PropTypes.object,
    value: PropTypes.object
  }

  state = {
    modalIsOpen: false,
    placeholder: ''
  }

  openModal = () => {
    this.setState({modalIsOpen: true})
  }

  closeModal = () => {
    this.setState({modalIsOpen: false})
  }

  updatePlaceholder = placeholder => {
    this.setState({placeholder})
  }

  renderPlaceholderOrName() {
    if (this.props.value) {
      if (this.props.value.name) {
        return this.props.value.name
      }
      return this.state.placeholder
    } else {
      return 'Generar Documento'
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
            formId={this.props.passProps.formId}
            updatePlaceholder={this.updatePlaceholder}
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
