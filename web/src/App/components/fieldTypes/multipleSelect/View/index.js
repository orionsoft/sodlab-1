import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.array,
    options: PropTypes.object
  }

  renderNoValue() {
    return <span className={styles.noValue}>Vacío</span>
  }

  renderSelectLabel() {
    const select = this.props.options || []
    const values = this.props.value || []
    const value = values.map(option => {
      return select.options.find(getValue => {
        return getValue.value === option
      })
    })

    return value.map(label => {
      return label.label
    })
  }

  render() {
    if (!this.props.value || this.props.value.length === 0) return this.renderNoValue()

    return (
      <div className={styles.container}>{(this.renderSelectLabel() || []).join(', ') || ''}</div>
    )
  }
}
