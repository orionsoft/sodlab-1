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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
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

  renderValue() {
    if (this.state.placeholder) {
      return <div className={styles.noValue}>{this.state.placeholder}</div>
    } else if (this.props.value) {
      if (typeof this.props.value === 'string') {
        const name = this.props.value
          .split('/')[5]
          .split('-')
          .filter((item, index) => index !== 0)
          .join('-')

        return (
          <div>
            <div className={styles.valueContainer}>
              <div className={styles.name}>{name}</div>
            </div>
          </div>
        )
      } else if (typeof this.props.value === 'object') {
        return (
          <div>
            <div className={styles.valueContainer}>
              <div className={styles.name}>{this.props.value.name}</div>
            </div>
          </div>
        )
      }
    } else {
      return <div className={styles.noValue}>Generar Documento</div>
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
          <div onClick={this.openModal} className={styles.container}>
            <div className={styles.placeholderContainer}>{this.renderValue()}</div>
          </div>
        </ClientProvider>
      </div>
    )
  }
}
