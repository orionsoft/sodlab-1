import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.object
  }

  renderNoValue() {
    return <span className={styles.noValue}>Vacío</span>
  }

  render() {
    if (!this.props.value || !this.props.value.name) return this.renderNoValue()
    return <div className={styles.container}>{this.props.value.name}</div>
  }
}
