import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'
import autobind from 'autobind-decorator'
import File from './File'

export default class Value extends React.Component {
  static propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
    openManager: PropTypes.func
  }

  @autobind
  onClick() {
    if (this.props.value) {
    } else {
      this.props.openManager()
    }
  }

  renderValue() {
    if (!this.props.value) return
    return (
      <div>
        <File fileId={this.props.value._id} clear={() => this.props.onChange(null)} />
      </div>
    )
  }

  renderNoValue() {
    if (this.props.value) return
    return <div className={styles.noValue}>Abrir archivos</div>
  }

  render() {
    return (
      <div className={styles.container} onClick={this.onClick}>
        {this.renderNoValue()}
        {this.renderValue()}
      </div>
    )
  }
}
