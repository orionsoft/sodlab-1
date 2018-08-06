import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    options: PropTypes.object
  }

  renderNoValue() {
    return <span className={styles.noValue}>Vacío</span>
  }

  renderValue() {
    const selectOptions = this.props.options || []
    const selectValue = selectOptions.options.find(option => {
      return option.value === this.props.value
    })

    return selectValue ? selectValue.label : null
  }

  render() {
    if (!this.props.value || this.props.value === '') return this.renderNoValue()
    return <span className={styles.container}>{this.renderValue()}</span>
  }
}
