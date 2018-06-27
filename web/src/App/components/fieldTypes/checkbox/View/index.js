import React from 'react'
import styles from './styles.css'
import PropTypes from 'prop-types'

export default class View extends React.Component {
  static propTypes = {
    value: PropTypes.bool,
    options: PropTypes.object
  }

  render() {
    const {trueLabel, falseLabel} = this.props.options
    const label = this.props.value ? trueLabel : falseLabel
    return <div className={styles.container}>{label}</div>
  }
}
